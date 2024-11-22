import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { Disclosure } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Unstable_Grid2";
import dayjs from "dayjs";
import { capitalize } from "@mui/material";

import type { Meal, MealExtra, Restaurant } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";

import { requireUserId } from "~/session.server";
import { getMeals, editMeal } from "~/models/meal.server";
import { getCuisines } from "~/models/cuisine.server";
import { getRestaurants } from "~/models/restaurant.server";
import MealIndexPanel from "~/components/MealIndexPanel";

export type MealContextType = {
  meal: Meal & { restaurant: Restaurant; extras: MealExtra[] };
};

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const urlSearch = new URLSearchParams(url.search);
  const filterId = urlSearch.get("filterId") || "";
  const filterType = urlSearch.get("filterType") || "";
  const showFriends = urlSearch.get("showFriends") || false;

  let startingFilterIdOption: { label: string; filterId: string } | undefined;
  let startingFilterTypeOption: { label: string; value: string } | undefined;
  let filterOptions: { label: string; filterId: string }[] = [];
  const mealsFetcher = getMeals({
    userId,
    filterId,
    filterType,
    showFriends: Boolean(showFriends),
  });
  const cuisinesFetcher = getCuisines();
  const restaurantsFetcher = getRestaurants();
  const [mealListItems, cuisines, restaurants] = await Promise.all([
    mealsFetcher,
    cuisinesFetcher,
    restaurantsFetcher,
  ]);

  if (filterType) {
    const dataToUse = filterType === "cuisines" ? cuisines : restaurants;
    const starter = dataToUse.find((data) => data.id === filterId);
    startingFilterIdOption = starter
      ? { label: starter.name, filterId: starter.id }
      : undefined;
    startingFilterTypeOption = {
      label: capitalize(filterType),
      value: filterType,
    };
    filterOptions = dataToUse.map((c) => {
      return { label: c.name, filterId: c.id };
    });
  }
  return json({
    startingFilterIdOption,
    startingFilterTypeOption,
    filterOptions,
    showFriends,
    filterType,
    mealListItems,
    userId,
    restaurants,
  });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  await editMeal({
    id: `${formData.get("mealId")}`,
    reservation: formData.get("reservation") === "on",
    queueTime: parseInt(`${formData.get("queueTime")}`) || 0,
    restaurantId: `${formData.get("new_restaurant")}`,
    userId,
    eatenAt: new Date(`${formData.get("eatenAt")}`),
  });

  return redirect("/app/meals");
}

export default function RestaurantsPage() {
  const data = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <div className="my-5 mx-auto max-w-2xl">
        <Grid container spacing={1}>
          <Grid xs={12} md={6} className="ml-5 mb-2 md:ml-0 md:mb-0">
            <FontAwesomeIcon icon={faFilter} size="2xl" className="mr-3" />
            <Select
              name="top-level-filter"
              options={[
                { label: "Cuisines", value: "cuisines" },
                { label: "Restaurants", value: "restaurants" },
              ]}
              className="mr-3 inline-block"
              placeholder="Select Filter"
              isClearable
              defaultValue={data.startingFilterTypeOption}
              onChange={(e) => {
                if (e?.value) {
                  searchParams.set("filterType", e.value);
                } else {
                  searchParams.delete("filterType");
                }
                searchParams.delete("filterId");
                setSearchParams(searchParams);
              }}
            />
            {data.filterType && (
              <div>
                <FontAwesomeIcon
                  icon={faFilter}
                  size="2xl"
                  className="mr-3"
                  style={{ visibility: "hidden" }}
                />
                <Select
                  name="filter"
                  options={data.filterOptions}
                  className="mr-3 mt-2 inline-block"
                  placeholder={capitalize(data.filterType)}
                  isClearable
                  defaultValue={data.startingFilterIdOption}
                  onChange={(e) => {
                    if (e?.filterId) {
                      searchParams.set("filterId", e.filterId);
                    } else {
                      searchParams.delete("filterId");
                    }
                    setSearchParams(searchParams);
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
                  checked={Boolean(data.showFriends)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.checked) {
                      searchParams.set("showFriends", "true");
                    } else {
                      searchParams.delete("showFriends");
                    }
                    setSearchParams(searchParams);
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
        let backgroundColor = "bg-sky-200 hover:bg-sky-300";
        if (meal.userId !== data.userId) {
          backgroundColor = "bg-violet-200 hover:bg-violet-300";
        }
        return (
          <li
            key={meal.id}
            className="my-5 mx-auto max-w-2xl rounded-md bg-white shadow-lg"
          >
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button
                    className={`flex w-full justify-between rounded-md ${backgroundColor} px-4 py-2 text-left font-medium text-sky-800`}
                  >
                    <span>{meal.restaurant.name}</span>
                    <span>{dayjs(eatenAt).format("L LT")}</span>
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500">
                    <MealIndexPanel
                      meal={{ ...meal, eatenAt }}
                      restaurants={data.restaurants}
                    />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </li>
        );
      })}
      <Outlet />
    </>
  );
}
