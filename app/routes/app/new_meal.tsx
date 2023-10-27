import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import qs from "qs";

import { getRestaurants } from "~/models/restaurant.server";
import { createMeal } from "~/models/meal.server";
import { requireUserId } from "~/session.server";
import MealForm from "~/components/MealForm";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import type { MealExtraParam } from "~/models/meal.server";

export async function loader({ request }: LoaderArgs) {
  const restaurants = await getRestaurants();
  return json({ restaurants });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const text = await request.text();
  const values = qs.parse(text);

  await createMeal({
    dish: `${values.dish}`,
    notes: `${values.notes}`,
    rating: parseInt(`${values.rating}`),
    cost: parseFloat(`${values.cost}`),
    reservation: values.reservation === "on",
    queueTime: parseInt(`${values.queueTime}`) || 0,
    restaurantId: `${values.new_restaurant}`,
    userId,
    eatenAt: new Date(`${values.eatenAt}`),
    extras: (values.extras || []) as unknown as MealExtraParam[],
  });

  return redirect("/app/meals");
}

export default function NewMealPage() {
  const data = useLoaderData<typeof loader>();
  return <MealForm restaurants={data.restaurants} isNew />;
}
