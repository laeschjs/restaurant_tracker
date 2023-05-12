import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { useMealFromContext } from "../meals";
import { getRestaurants } from "~/models/restaurant.server";
import MealForm from "~/components/MealForm";
import { requireUserId } from "~/session.server";
import { editMeal } from "~/models/meal.server";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const restaurants = await getRestaurants();
  return json({ restaurants });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  await editMeal({
    id: `${formData.get("mealId")}`,
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

export default function Index() {
  const { meal } = useMealFromContext();
  const { restaurants } = useLoaderData<typeof loader>();
  const [editMode, setEditMode] = useState<boolean>(false);
  if (editMode) {
    return (
      <MealForm
        restaurants={restaurants}
        meal={meal}
        cancelFunc={() => setEditMode(false)}
      />
    );
  }
  return (
    <div className="grid grid-cols-4">
      <div className="col-span-1 mt-1">Dish:</div>
      <div className="col-span-2 mt-1">{meal.dish}</div>
      <div className="col-span-1 mt-1 text-end">
        <button
          className="text-blue-500 underline"
          onClick={() => setEditMode(true)}
        >
          Edit
        </button>
      </div>
      <div className="col-span-1 mt-1">Notes:</div>
      <div className="col-span-3 mt-1">{meal.notes}</div>
      <div className="col-span-1 mt-1">Rating:</div>
      <div className="col-span-3 mt-1">{meal.rating}⭐️</div>
      <div className="col-span-1 mt-1">Cost:</div>
      <div className="col-span-3 mt-1">${meal.cost}</div>
      <div className="col-span-1 mt-1">Reservation:</div>
      <div className="col-span-3 mt-1">{meal.reservation ? "Yes" : "No"}</div>
      <div className="col-span-1 mt-1">Wait Time:</div>
      <div className="col-span-3 mt-1">{meal.queueTime} minutes</div>
    </div>
  );
}
