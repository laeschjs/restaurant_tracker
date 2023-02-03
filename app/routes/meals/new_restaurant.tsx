import { Form, Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useState, useEffect } from "react";

import { upsertRestaurant, getRestaurants } from "~/models/restaurant.server";
import { getCuisines } from "~/models/cuisine.server";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const cuisines = await getCuisines();
  const restaurants = await getRestaurants();
  return json({ cuisines, restaurants });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  await upsertRestaurant({
    name: `${formData.get("restaurant_name")}`,
    cuisines: formData.getAll("cuisines"),
  });

  return redirect("/meals");
}

function makeOptions(obj) {
  return { label: obj.name, value: obj.name, obj: obj };
}

async function setRestaurantCuisines(option, action) {
  const cuisines = option.obj.cuisines.map((mapper) => mapper.cuisine);
  action(cuisines.map(makeOptions));
}

export default function NewRestaurantPage() {
  const data = useLoaderData<typeof loader>();
  const cuisineOptions = data.cuisines.map(makeOptions);
  const restaurantOptions = data.restaurants.map(makeOptions);
  const [selectedCusines, setSelectedCuisines] = useState([]);

  return (
    <div className="mx-auto mt-5 flex max-w-lg">
      <Form
        method="post"
        className="w-full rounded-md bg-white p-5 shadow-lg"
        reloadDocument
      >
        <span className="mb-1 inline-block">
          Restaurant Name (Type to create new):
        </span>
        <CreatableSelect
          name="restaurant_name"
          options={restaurantOptions}
          onChange={(e) => setRestaurantCuisines(e, setSelectedCuisines)}
          className="col-span-3"
        />
        <span className="mt-5 mb-1 inline-block">Cuisines:</span>
        <Select
          name="cuisines"
          value={selectedCusines}
          options={cuisineOptions}
          onChange={(e) => setSelectedCuisines(e)}
          isMulti
          className="col-span-3"
        />
        <button
          type="submit"
          className="mt-5 rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Save
        </button>
        <Link to="/meals" className="mt-5 ml-5 text-pink-400">
          Cancel
        </Link>
      </Form>
    </div>
  );
}
