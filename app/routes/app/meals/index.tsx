import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { useMealFromContext } from "../meals";
import { getRestaurants } from "~/models/restaurant.server";
import MealForm from "~/components/MealForm";
import { requireUserId } from "~/session.server";
import { editMeal } from "~/models/meal.server";

import type { LoaderArgs, ActionArgs } from "@remix-run/node";

enum MealExtraLabel {
  entree = "Entree",
  appetizer = "Appetizer",
  drink = "Drink",
  dessert = "Dessert",
}

export async function loader({ request }: LoaderArgs) {
  const restaurants = await getRestaurants();
  return json({ restaurants });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  await editMeal({
    id: `${formData.get("mealId")}`,
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
  const navigate = useNavigate();
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
    <>
      <div className="grid grid-cols-4">
        <div className="col-span-1 mt-1">Reservation:</div>
        <div className="col-span-1 mt-1">{meal.reservation ? "Yes" : "No"}</div>
        <div className="col-span-2 text-end">
          <button
            className="text-blue-500 underline"
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
          <button
            className="ml-3 text-red-500 underline"
            onClick={() => navigate(`${meal.id}/delete`)}
          >
            Delete
          </button>
        </div>
        <div className="col-span-1 mt-1">Wait Time:</div>
        <div className="col-span-3 mt-1 mb-3">{meal.queueTime} minutes</div>
      </div>

      {meal.extras.map((extra) => (
        <Accordion key={extra.id}>
          <AccordionSummary
            expandIcon={<FontAwesomeIcon icon={faChevronDown} size="sm" />}
          >
            <b>
              {
                MealExtraLabel[
                  extra.type as "entree" | "appetizer" | "drink" | "dessert"
                ]
              }
            </b>
          </AccordionSummary>
          <AccordionDetails>
            <div className="grid grid-cols-4">
              <div className="col-span-1 mt-1">Name:</div>
              <div className="col-span-3 mt-1">{extra.name}</div>
              <div className="col-span-1 mt-1">Notes:</div>
              <div className="col-span-3 mt-1">{extra.notes}</div>
              <div className="col-span-1 mt-1">Rating:</div>
              <div className="col-span-3 mt-1">{extra.rating}⭐️</div>
              <div className="col-span-1 mt-1">Cost:</div>
              <div className="col-span-3 mt-1">${extra.cost}</div>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
