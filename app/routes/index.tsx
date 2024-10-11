import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
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
                  to="/parks"
                  className="mt-2 flex justify-center rounded-md bg-pink-400 px-4 py-3 font-medium text-white hover:bg-pink-600 sm:mt-0 sm:mr-3"
                >
                  Theme Park Tracker
                </Link>
                <Form action="/logout" method="post">
                  <button
                    type="submit"
                    className="mt-2 flex w-full justify-center rounded-md bg-slate-600 py-3 px-4 font-medium text-white hover:bg-sky-300 sm:mt-0"
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
            <div className="mt-10 text-center">Logged in as: {user.email}</div>
          )}
        </div>
      </div>
    </main>
  );
}
