import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import type { NavigateFunction } from "react-router-dom";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getMeals } from "~/models/meal.server";
import { getCuisines } from "~/models/cuisine.server";

export async function loader({ request }: LoaderArgs) {
  const urlSearch = new URL(request.url);
  const cuisineId = urlSearch.searchParams.get("filter");
  const showFriends = urlSearch.searchParams.get("showFriends");
  const userId = await requireUserId(request);
  const mealListItems = await getMeals({
    userId,
    cuisineId,
    showFriends: Boolean(showFriends),
  });
  const cuisines = await getCuisines();
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

export default function RestaurantsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const isAdmin =
    user.email === "test@test.com" || user.email === "joshua.laesch@gmail.com";
  const [switchCheck, setChecked] = useState<boolean>(
    Boolean(data.showFriends)
  );
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Outlet />
      <div className="my-5 mx-auto max-w-2xl">
        <FontAwesomeIcon icon={faFilter} size="2xl" className="mr-3" />
        <Select
          name="filter"
          options={data.cuisines}
          className="mr-3 inline-block"
          placeholder="Cuisines"
          isClearable
          defaultValue={data.startingCuisine}
          onChange={(e) => {
            customNavigate("filter", e?.value || "", location.search, navigate);
          }}
        />
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
                    <span>{eatenAt.toLocaleDateString()}</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500">
                    <div className="grid grid-cols-4">
                      <div className="col-span-1 mt-1">Dish:</div>
                      <div className="col-span-3 mt-1">{meal.dish}</div>
                      <div className="col-span-1 mt-1">Notes:</div>
                      <div className="col-span-3 mt-1">{meal.notes}</div>
                      <div className="col-span-1 mt-1">Rating:</div>
                      <div className="col-span-3 mt-1">{meal.rating}⭐️</div>
                      <div className="col-span-1 mt-1">Cost:</div>
                      <div className="col-span-3 mt-1">${meal.cost}</div>
                      <div className="col-span-1 mt-1">Reservation:</div>
                      <div className="col-span-3 mt-1">
                        {meal.reservation ? "Yes" : "No"}
                      </div>
                      <div className="col-span-1 mt-1">Wait Time:</div>
                      <div className="col-span-3 mt-1">
                        {meal.queueTime} minutes
                      </div>
                    </div>
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
