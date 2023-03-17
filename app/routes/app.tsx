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

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getMeals } from "~/models/meal.server";
import { getCuisines } from "~/models/cuisine.server";

export async function loader({ request }: LoaderArgs) {
  const urlSearch = new URL(request.url);
  const cuisineId = urlSearch.searchParams.get("filter");
  const userId = await requireUserId(request);
  const mealListItems = await getMeals({ userId, cuisineId });
  const cuisines = await getCuisines();
  return json({
    mealListItems,
    cuisines: cuisines.map((c) => {
      return { label: c.name, value: c.id };
    }),
  });
}

export default function RestaurantsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();
  const isAdmin =
    user.email === "test@test.com" || user.email === "joshua.laesch@gmail.com";
  const navigate = useNavigate();

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
            to="/app/meals"
            className={({ isActive }) =>
              `block border-b border-black p-4 text-xl hover:bg-purple-200 ${
                isActive ? "bg-pink-400 text-blue-100 hover:bg-pink-400" : ""
              }`
            }
          >
            View Meals
          </NavLink>
          <NavLink
            to="/app/new_meal"
            className={({ isActive }) =>
              `block border-b border-black p-4 text-xl hover:bg-purple-200 ${
                isActive ? "bg-pink-400 text-blue-100 hover:bg-pink-400" : ""
              }`
            }
          >
            Add Meal
          </NavLink>
          <NavLink
            to="/app/new_restaurant"
            className={({ isActive }) =>
              `block border-b border-black p-4 text-xl hover:bg-purple-200 ${
                isActive ? "bg-pink-400 text-blue-100 hover:bg-pink-400" : ""
              }`
            }
          >
            Add Restaurant
          </NavLink>
          <NavLink
            to="/app/friends"
            className={({ isActive }) =>
              `block border-b border-black p-4 text-xl hover:bg-purple-200 ${
                isActive ? "bg-pink-400 text-blue-100 hover:bg-pink-400" : ""
              }`
            }
          >
            Friends
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
        </ol>
      </main>
    </div>
  );
}
