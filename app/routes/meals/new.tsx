import { Form, useLoaderData, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";

import { getRestaurants } from "~/models/restaurant.server";
import { createMeal } from "~/models/meal.server";
import { requireUserId } from "~/session.server";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const restaurants = await getRestaurants();
  return json({ restaurants });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  await createMeal({
    dish: `${formData.get("dish")}`,
    notes: `${formData.get("notes")}`,
    rating: parseInt(`${formData.get("rating")}`),
    cost: parseFloat(`${formData.get("cost")}`),
    reservation: formData.get("reservation") === "true",
    queueTime: parseInt(`${formData.get("queueTime")}`) || 0,
    restaurantId: `${formData.get("new_restaurant")}`,
    userId,
  });

  return redirect("/meals");
}

export default function NewMealPage() {
  const data = useLoaderData<typeof loader>();
  /*
    - The below link for reloadDocument also has a section on animating. Seems dumb I have to build it from
      scratch but would make it nice. Save it for a follow up
      EDIT maybe can just find existing react components like I did for react-select
  */
  return (
    <div className="mx-auto flex max-w-lg">
      <Form
        id="new_restaurant"
        method="post"
        className="w-full rounded-md bg-white p-5 shadow-lg"
        //The line below https://remix.run/docs/en/v1/guides/data-writes and search
        reloadDocument
      >
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Restaurant: </span>
          <select
            name="new_restaurant"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          >
            {data.restaurants.map((restaurant) => {
              return (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              );
            })}
          </select>
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Dish: </span>
          <input
            name="dish"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Notes: </span>
          <input
            name="notes"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Rating: </span>
          <input
            name="rating"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
            type="number"
            min="1"
            max="10"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Cost: </span>
          <input
            name="cost"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Reservation: </span>
          <div className="col-span-3 grid grid-cols-4">
            <div className="col-span-1 col-start-2">
              <input
                name="reservation"
                type="radio"
                id="reservation_yes"
                className="mr-2"
                value="true"
              />
              <label htmlFor="reservation_yes">YES</label>
            </div>
            <div className="col-span-1 col-start-3">
              <input
                name="reservation"
                type="radio"
                id="reservation_no"
                className="mr-2"
                value="false"
              />
              <label htmlFor="reservation_no">NO</label>
            </div>
          </div>
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Wait Time: </span>
          <input
            name="queueTime"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
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
