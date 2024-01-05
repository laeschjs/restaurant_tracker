import { redirect } from "@remix-run/node";
import { deleteMeal } from "~/models/meal.server";
import type { ActionArgs } from "@remix-run/node";

export async function action({ params }: ActionArgs) {
  if (!params.mealId) {
    return redirect("/app/meals");
  }

  await deleteMeal(params.mealId);

  return redirect("/app/meals");
}
