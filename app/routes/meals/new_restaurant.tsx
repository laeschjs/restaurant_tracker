import { Form, Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import Select from "react-select";

import { createRestaurant } from "~/models/restaurant.server";
import { getCuisines } from "~/models/cuisine.server";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const cuisines = await getCuisines();
  return json({ cuisines });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  await createRestaurant({
    name: `${formData.get("name")}`,
    cuisines: formData.getAll("cuisines"),
  });

  return redirect("/meals");
}

export default function NewRestaurantPage() {
  const data = useLoaderData<typeof loader>();
  const options = data.cuisines.map((cuisine) => {
    return { label: cuisine.name, value: cuisine.name };
  });

  return (
    <div className="mx-auto flex max-w-lg">
      <Form
        method="post"
        className="w-full rounded-md bg-white p-5 shadow-lg"
        reloadDocument
      >
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Name: </span>
          <input
            name="name"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Cuisines: </span>
          <Select
            name="cuisines"
            options={options}
            isMulti
            className="col-span-3"
          />
        </label>
        <button
          type="submit"
          className="mt-5 rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Save
        </button>
        <Link to="/meals" className="mt-5 ml-5 text-pink-400">
          Cancel
        </Link>
      </Form>
    </div>
  );
}
