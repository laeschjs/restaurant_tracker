import { Form, Link, NavLink, Outlet } from "@remix-run/react";
import Grid from "@mui/material/Unstable_Grid2";

import { useUser } from "~/utils";

export default function RestaurantsPage() {
  const user = useUser();
  const isAdmin =
    user.email === "test@test.com" || user.email === "joshua.laesch@gmail.com";

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="bg-sky-300 p-4 text-white">
        <Grid container spacing={1}>
          <Grid xs={12} className="text-center">
            <h1 className="text-3xl font-bold">JK's Restaurants</h1>
          </Grid>
          <Grid xs={12} md={4} className="text-center md:text-left">
            {user.email}
          </Grid>
          <Grid xs={12} md={4} className="text-center">
            <Link
              to=".."
              className="inline-block rounded bg-violet-400 py-2 px-4 text-blue-100 hover:bg-violet-500"
            >
              Home
            </Link>
          </Grid>
          <Grid xs={12} md={4} className="text-center md:text-right">
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-pink-400 py-2 px-4 text-blue-100 hover:bg-pink-500"
              >
                Logout
              </button>
            </Form>
          </Grid>
        </Grid>
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
