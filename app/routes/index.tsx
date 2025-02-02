import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import { getActiveThemeParkVisits } from "~/models/themeParkVisit.server";
import { requireUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

import type { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const visits = await getActiveThemeParkVisits({ userId });
  return json({ activeVisit: visits[0] }); // There should only be one active visit
}

export default function Index() {
  const { activeVisit } = useLoaderData();
  const user = useOptionalUser();
  return (
    <main className="min-h-screen bg-sky-300 px-3 pt-3 sm:flex sm:items-center sm:justify-center">
      <div className="rounded-2xl bg-white shadow-xl sm:overflow-hidden">
        <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <h1 className="text-center text-6xl font-extrabold tracking-tight">
            <span className="block text-pink-400 drop-shadow-md">
              JK's App Suite
            </span>
          </h1>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none">
            {user ? (
              <>
                <Link
                  to="/app/meals"
                  className="flex justify-center rounded-md bg-violet-400 px-4 py-3 font-medium text-white hover:bg-violet-600 sm:mr-3"
                >
                  Restaurant Tracker
                </Link>
                <Link
                  to={
                    activeVisit
                      ? `/parks/new_visit/${activeVisit.id}`
                      : "/parks"
                  }
                  className="mt-2 flex justify-center rounded-md bg-pink-400 px-4 py-3 font-medium text-white hover:bg-pink-600 sm:mt-0 sm:mr-3"
                >
                  Theme Park Tracker
                </Link>
                <Form
                  action="/logout"
                  method="post"
                  className="mt-2 sm:mt-0 sm:mr-3"
                >
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-slate-600 py-3 px-4 font-medium text-white hover:bg-sky-300"
                  >
                    Logout
                  </button>
                </Form>
                <Link
                  to="/seventy_five_hard"
                  className="mt-2 flex justify-center rounded-md bg-red-400 px-4 py-3 font-medium text-white hover:bg-red-600 sm:mt-0"
                >
                  75 Hard
                </Link>
              </>
            ) : (
              <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <Link
                  to="/join"
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-pink-700 shadow-sm hover:bg-pink-50 sm:px-8"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-md bg-pink-400 px-4 py-3 font-medium text-white hover:bg-pink-600"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
          {user && (
            <div className="mt-10 text-center">Logged in as: {user.email}</div>
          )}
        </div>
      </div>
    </main>
  );
}
