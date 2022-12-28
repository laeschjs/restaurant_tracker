import { Link } from "@remix-run/react";

export default function AddMealButton() {
  return (
    <div className="flex">
      <Link
        to="new"
        className="mx-auto mt-5 inline-block rounded-md bg-sky-100 py-2 px-4 font-medium text-sky-800 shadow-lg"
      >
        + Add Meal
      </Link>
    </div>
  );
}
