import { Form, Link, NavLink, Outlet } from "@remix-run/react";
import Grid from "@mui/material/Unstable_Grid2"; // TODO: Update mui to v6 and change Unstable_Grid2 to Grid2
import { CreateOutlined, GridOn } from "@mui/icons-material";

import { useUser } from "~/utils";

export default function Index() {
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="bg-sky-300 p-4 text-white">
        <Grid container spacing={1}>
          <Grid xs={12} className="text-center">
            <h1 className="text-3xl font-bold">75 Hard Tracker</h1>
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
      <div className="grid grid-flow-col gap-3">
        <NavLink
          to="/seventy_five_hard"
          className={({ isActive }) =>
            `me-3 justify-self-end border-b p-4 text-xl hover:bg-sky-100 ${
              isActive
                ? "border-sky-400 text-sky-400"
                : "border-neutral-300 text-neutral-400"
            }`
          }
        >
          <GridOn className="mr-2" />
          Progress
        </NavLink>
        <NavLink
          to="/seventy_five_hard/daily"
          className={({ isActive }) =>
            `ms-3 justify-self-start border-b p-4 text-xl hover:bg-sky-100 ${
              isActive
                ? "border-sky-400 text-sky-400"
                : "border-neutral-300 text-neutral-400"
            }`
          }
        >
          <CreateOutlined className="mr-2" />
          Daily
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
