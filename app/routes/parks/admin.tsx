import { Form, Link, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
import Select from "react-select";

import { createPopularity } from "~/models/popularity.server";

import type { ActionArgs } from "@remix-run/node";
import { Alert } from "@mui/material";
import { createThemePark } from "~/models/themePark.server";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const { entity, ...values } = Object.fromEntries(formData);

  switch (entity) {
    case "themePark":
      await createThemePark({ name: `${values.name}` });
      break;
    case "popularity":
      await createPopularity({
        type: `${values.type}`,
        lowRange: parseInt(`${values.lowRange}`) || 0,
        midRange: parseInt(`${values.midRange}`) || 0,
        highRange: parseInt(`${values.highRange}`) || 0,
      });
      break;
  }

  return json({ message: `Successfully created ${entity}` });
}

export default function AdminPage() {
  const response = useActionData();
  return (
    <div className="mx-auto mt-5 max-w-lg">
      {response && (
        <Alert severity="success" variant="outlined" className="mb-5">
          {response.message}
        </Alert>
      )}
      <Form
        method="post"
        className="mt-3 w-full rounded-md bg-white p-5 shadow-lg"
        reloadDocument
      >
        <span className="text-2xl">Add Theme Park</span>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Name: </span>
          <input
            name="name"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <button
          type="submit"
          name="entity"
          value="themePark"
          className="mt-5 rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Save
        </button>
        <Link to=".." className="mt-5 ml-5 text-pink-400">
          Cancel
        </Link>
      </Form>
      <Form
        method="post"
        className="mt-3 w-full rounded-md bg-white p-5 shadow-lg"
        reloadDocument
      >
        <span className="text-2xl">Add Popularity</span>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Type: </span>
          <Select
            name="type"
            options={[
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ]}
            className="col-span-3"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Low Range: </span>
          <input
            name="lowRange"
            type="number"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Mid Range: </span>
          <input
            name="midRange"
            type="number"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">High Range: </span>
          <input
            name="highRange"
            type="number"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <button
          type="submit"
          name="entity"
          value="popularity"
          className="mt-5 rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Save
        </button>
        <Link to=".." className="mt-5 ml-5 text-pink-400">
          Cancel
        </Link>
      </Form>
    </div>
  );
}
