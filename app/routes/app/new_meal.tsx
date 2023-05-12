import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { getRestaurants } from "~/models/restaurant.server";
import { createMeal } from "~/models/meal.server";
import { requireUserId } from "~/session.server";
import MealForm from "~/components/MealForm";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const restaurants = await getRestaurants();
  return json({ restaurants });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  await createMeal({
    dish: `${formData.get("dish")}`,
    notes: `${formData.get("notes")}`,
    rating: parseInt(`${formData.get("rating")}`),
    cost: parseFloat(`${formData.get("cost")}`),
    reservation: formData.get("reservation") === "on",
    queueTime: parseInt(`${formData.get("queueTime")}`) || 0,
    restaurantId: `${formData.get("new_restaurant")}`,
    userId,
    eatenAt: new Date(`${formData.get("eatenAt")}`),
  });

  return redirect("/app/meals");
}

export default function NewMealPage() {
  const data = useLoaderData<typeof loader>();
  return <MealForm restaurants={data.restaurants} isNew />;
}
