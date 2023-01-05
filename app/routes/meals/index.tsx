import { Link } from "@remix-run/react";
import { useUser } from "~/utils";

export default function AddMealButton() {
  const user = useUser();
  const isAdmin =
    user.email === "test@test.com" || user.email === "joshua.laesch@gmail.com";

  return (
    <div className="mx-auto flex grid max-w-lg grid-flow-col justify-items-center">
      <Link
        to="new"
        className="mt-5 w-fit rounded-md bg-sky-100 py-2 px-4 font-medium text-sky-800 shadow-lg"
      >
        + Add Meal
      </Link>
      <Link
        to="new_restaurant"
        className="mt-5 w-fit rounded-md bg-sky-100 py-2 px-4 font-medium text-sky-800 shadow-lg"
      >
        + Add Restaurant
      </Link>
      {isAdmin && (
        <Link
          to="admin"
          className="mt-5 w-fit rounded-md bg-sky-100 py-2 px-4 font-medium text-sky-800 shadow-lg"
        >
          Admin View
        </Link>
      )}
    </div>
  );
}
