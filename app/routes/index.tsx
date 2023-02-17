import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-sky-300 sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative bg-white shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pb-14 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight">
                <span className="block uppercase text-pink-400 drop-shadow-md">
                  JK's Restaurant Tracker
                </span>
              </h1>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <>
                    <Link
                      to="/app/meals"
                      className="mx-3 flex items-center justify-center rounded-md bg-pink-400 px-4 py-3 font-medium text-white hover:bg-pink-600"
                    >
                      View Restaurants
                    </Link>
                    <Form action="/logout" method="post">
                      <button
                        type="submit"
                        className="rounded bg-slate-600 py-2 px-4 font-medium text-blue-100 hover:bg-sky-300 active:bg-blue-600"
                      >
                        Logout
                      </button>
                    </Form>
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
                <div className="mt-10 text-center">
                  Logged in as: {user.email}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
