import { redirect } from "@remix-run/node";
import { deleteMeal } from "~/models/meal.server";
import type { ActionArgs } from "@remix-run/node";
import { Modal } from "@mui/material";
import { Form, useNavigate } from "@remix-run/react";

export async function action({ params }: ActionArgs) {
  if (!params.mealId) {
    return redirect("/app/meals");
  }

  await deleteMeal(params.mealId);

  return redirect("/app/meals");
}

export default function DeleteMeal({ mealId }: { mealId: string }) {
  const navigate = useNavigate();
  return (
    <Modal open onClose={() => navigate("/app/meals")}>
      <div className="flex h-full items-center justify-center">
        <div className="flex h-48 w-5/6 flex-col items-center justify-between rounded-md bg-white p-3 md:w-1/3">
          <h1 className="mt-4 text-xl">
            Are you sure you want to delete this?
          </h1>
          <div className="mt-3 space-x-4">
            <Form method="delete" className="inline-block">
              <button
                type="submit"
                className="rounded-md bg-red-500 px-3 py-1 text-white"
              >
                Delete
              </button>
            </Form>
            <button
              className="mr-3 rounded-md bg-gray-500 px-3 py-1 text-white"
              onClick={() => navigate("/app/meals")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
