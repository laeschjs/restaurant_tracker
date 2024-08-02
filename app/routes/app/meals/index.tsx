import { useState } from "react";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "@mui/material";

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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
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
            onClick={() => setOpenDeleteModal(true)}
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
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div className="flex h-full items-center justify-center">
          <div className="flex h-48 w-5/6 flex-col items-center justify-between rounded-md bg-white p-3 md:w-1/3">
            <h1 className="mt-4 text-xl">
              Are you sure you want to delete this?
            </h1>
            <div className="mt-3 space-x-4">
              <Form
                method="delete"
                action={`${meal.id}/delete`}
                className="inline-block"
              >
                <button
                  type="submit"
                  className="rounded-md bg-red-500 px-3 py-1 text-white"
                >
                  Delete
                </button>
              </Form>
              <button
                className="mr-3 rounded-md bg-gray-500 px-3 py-1 text-white"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
