import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { Disclosure } from "@headlessui/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getMeals } from "~/models/meal.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const mealListItems = await getMeals({ userId });
  return json({ mealListItems });
}

export default function RestaurantsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const isAdmin =
    user.email === "test@test.com" || user.email === "joshua.laesch@gmail.com";

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-sky-300 p-4 text-white">
        <h1 className="text-3xl font-bold">Restaurants</h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-pink-400 py-2 px-4 text-blue-100 hover:bg-pink-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <main className="h-full grid-cols-4 bg-gray-100 sm:grid">
        <div className="col-span-1 border-r border-black">
          <NavLink
            to="new"
            className={({ isActive }) =>
              `block border-b border-black p-4 text-xl hover:bg-purple-200 ${
                isActive ? "bg-pink-400 text-blue-100 hover:bg-pink-400" : ""
              }`
            }
          >
            + Add Meal
          </NavLink>
          <NavLink
            to="new_restaurant"
            className={({ isActive }) =>
              `block border-b border-black p-4 text-xl hover:bg-purple-200 ${
                isActive ? "bg-pink-400 text-blue-100 hover:bg-pink-400" : ""
              }`
            }
          >
            + Add Restaurant
          </NavLink>
          {isAdmin && (
            <NavLink
              to="admin"
              className={({ isActive }) =>
                `block border-b border-black p-4 text-xl hover:bg-purple-200 ${
                  isActive ? "bg-pink-400 text-blue-100 hover:bg-pink-400" : ""
                }`
              }
            >
              Admin View
            </NavLink>
          )}
        </div>
        <ol className="col-span-3">
          <Outlet />
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
                          <div className="col-span-3 mt-1">
                            {meal.rating}⭐️
                          </div>
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
        </ol>
      </main>
    </div>
  );
}
