import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import dayjs from "dayjs";

import type { NavigateFunction } from "react-router-dom";
import type { Meal, MealExtra, Restaurant } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";

import { requireUserId } from "~/session.server";
import { getMeals } from "~/models/meal.server";
import { getCuisines } from "~/models/cuisine.server";

type ContextType = {
  meal: Meal & { restaurant: Restaurant; extras: MealExtra[] };
};

export async function loader({ request }: LoaderArgs) {
  const urlSearch = new URL(request.url);
  const cuisineId = urlSearch.searchParams.get("filter");
  const showFriends = urlSearch.searchParams.get("showFriends");
  const userId = await requireUserId(request);
  const mealsFetcher = getMeals({
    userId,
    cuisineId,
    showFriends: Boolean(showFriends),
  });
  const cuisinesFetcher = getCuisines();
  const [mealListItems, cuisines] = await Promise.all([
    mealsFetcher,
    cuisinesFetcher,
  ]);
  const startingCuisine = cuisines.find((c) => c.id === cuisineId);
  const startingCuisineOption = startingCuisine
    ? { label: startingCuisine.name, value: startingCuisine.id }
    : undefined;
  return json({
    startingCuisine: startingCuisineOption,
    showFriends,
    mealListItems,
    cuisines: cuisines.map((c) => {
      return { label: c.name, value: c.id };
    }),
  });
}

function customNavigate(
  key: string,
  value: string | boolean,
  searchParams: string,
  navigate: NavigateFunction
) {
  if (searchParams) {
    let searchParts = searchParams.split("&");
    searchParts[0] = searchParts[0].replace("?", "");
    let keyInParams = false;
    searchParts = searchParts.reduce((result: Array<string>, part: string) => {
      if (!part.includes(key + "=")) {
        return result.concat([part]);
      } else {
        keyInParams = true;
        if (value) {
          result.push(key + "=" + value);
        }
        return result;
      }
    }, []);
    if (!keyInParams) searchParts.push(key + "=" + value);

    navigate("?" + searchParts.join("&"));
  } else if (value) {
    navigate("?" + key + "=" + value);
  } else {
    navigate("");
  }
}

export function useMealFromContext() {
  return useOutletContext<ContextType>();
}

export default function RestaurantsPage() {
  const data = useLoaderData<typeof loader>();
  const [switchCheck, setChecked] = useState<boolean>(
    Boolean(data.showFriends)
  );
  const [whatToFilterOn, setWhatToFilterOn] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <div className="my-5 mx-auto max-w-2xl">
        <Grid container spacing={1}>
          <Grid xs={12} md={6} className="ml-5 mb-2 md:ml-0 md:mb-0">
            <FontAwesomeIcon icon={faFilter} size="2xl" className="mr-3" />
            <Select
              name="top-level-filter"
              options={[
                { label: "Cuisines", value: "Cuisines" },
                { label: "Restaurants", value: "Restaurants" },
              ]}
              className="mr-3 inline-block"
              placeholder="Select Filter"
              isClearable
              onChange={(e) => {
                setWhatToFilterOn(e?.value || "");
                customNavigate("filter", "", location.search, navigate);
              }}
            />
            {whatToFilterOn === "Cuisines" && (
              <div>
                <FontAwesomeIcon
                  icon={faFilter}
                  size="2xl"
                  className="mr-3"
                  style={{ visibility: "hidden" }}
                />
                <Select
                  name="filter"
                  options={data.cuisines}
                  className="mr-3 inline-block md:mt-2"
                  placeholder="Cuisines"
                  isClearable
                  defaultValue={data.startingCuisine}
                  onChange={(e) => {
                    customNavigate(
                      "filter",
                      e?.value || "",
                      location.search,
                      navigate
                    );
                  }}
                />
              </div>
            )}
          </Grid>
          <Grid xs={12} md={6} className="md:grid md:justify-items-end">
            <FormControlLabel
              labelPlacement="start"
              control={
                <Switch
                  color="secondary"
                  checked={switchCheck}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setChecked(e.target.checked);
                    customNavigate(
                      "showFriends",
                      e.target.checked,
                      location.search,
                      navigate
                    );
                  }}
                />
              }
              label="Show Friends Meals"
            />
          </Grid>
        </Grid>
      </div>
      {data.mealListItems.map((meal) => {
        const eatenAt = new Date(meal.eatenAt);
        return (
          <li
            key={meal.id}
            className="my-5 mx-auto max-w-2xl rounded-md bg-white shadow-lg"
          >
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-md bg-sky-100 px-4 py-2 text-left font-medium text-sky-800 hover:bg-sky-200">
                    <span>{meal.restaurant.name}</span>
                    <span>{dayjs(eatenAt).format("L LT")}</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500">
                    <Outlet context={{ meal }} />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </li>
        );
      })}
    </>
  );
}
