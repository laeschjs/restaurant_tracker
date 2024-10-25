import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Grid from "@mui/material/Unstable_Grid2"; // TODO: Update mui to v6 and change Unstable_Grid2 to Grid2

import { useUser } from "~/utils";
import { requireUserId } from "~/session.server";
import { getActiveThemeParkVisits } from "~/models/themeParkVisit.server";

import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const visits = await getActiveThemeParkVisits({ userId });
  return json({ activeVisit: visits[0] }); // There should only be one active visit
}

export default function Index() {
  const user = useUser();
  const isAdmin =
    user.email === "test@test.com" ||
    user.email === "joshua.laesch@gmail.com" ||
    user.email === "kylielaesch@gmail.com";
  const { activeVisit } = useLoaderData();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="bg-sky-300 p-4 text-white">
        <Grid container spacing={1}>
          <Grid xs={12} className="text-center">
            <h1 className="text-3xl font-bold">JK's Theme Parks</h1>
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
            to={activeVisit ? `new_visit/${activeVisit.id}` : "new_visit"}
            className={({ isActive }) =>
              `block border-b border-black p-4 text-xl hover:bg-purple-200 ${
                isActive ? "bg-pink-400 text-blue-100 hover:bg-pink-400" : ""
              }`
            }
          >
            New Visit
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
