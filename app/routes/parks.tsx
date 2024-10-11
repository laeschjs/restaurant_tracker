import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import Grid from "@mui/material/Unstable_Grid2";
import { useUser } from "~/utils";

export async function loader() {
  return json({ hello: "world" });
}

export default function Index() {
  const { hello } = useLoaderData();

  const user = useUser();
  const isAdmin =
    user.email === "test@test.com" ||
    user.email === "joshua.laesch@gmail.com" ||
    user.email === "kylielaesch@gmail.com";

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="bg-sky-300 p-4 text-white">
        <Grid container spacing={1}>
          <Grid xs={12} className="text-center">
            <h1 className="text-3xl font-bold">JK's Theme Parks</h1>
          </Grid>
          <Grid
            xs={12}
            md={4}
            mdOffset={2}
            className="text-center md:text-left"
          >
            {user.email}
          </Grid>
          <Grid xs={12} md={4} className="text-center md:text-right">
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-pink-500 py-2 px-4 text-blue-100 hover:bg-pink-600"
              >
                Logout
              </button>
            </Form>
          </Grid>
        </Grid>
      </header>
      <main className="h-full grid-cols-4 bg-gray-100 sm:grid">
        <div className="col-span-1 border-r border-black">
        </div>
        <ol className="col-span-3">
          <div>{hello}</div>
          <Outlet />
        </ol>
      </main>
    </div>
  );
}
