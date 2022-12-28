import { Link } from "@remix-run/react";

export default function AddMealButton() {
  return (
    <div className="mx-auto flex grid max-w-lg grid-cols-2 justify-items-center">
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
    </div>
  );
}
