import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";

import { createRestaurant } from "~/models/restaurant.server";

import type { ActionArgs } from "@remix-run/node";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  await createRestaurant({
    name: `${formData.get("name")}`,
  });

  return redirect("/meals");
}

export default function NewRestaurantPage() {
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
        <button
          type="submit"
          className="mt-5 rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
