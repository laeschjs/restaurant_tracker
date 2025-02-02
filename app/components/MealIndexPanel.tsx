import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import MealForm from "./MealForm";

import type { Restaurant, Meal, MealExtra } from "@prisma/client";

interface MealIndexPanelProps {
  restaurants: Restaurant[];
  meal: Meal & { restaurant: Restaurant; extras: MealExtra[] };
}

export enum MealExtraLabel {
  entree = "Entree",
  appetizer = "Appetizer",
  drink = "Drink",
  dessert = "Dessert",
}

export default function MealIndexPanel({
  restaurants,
  meal,
}: MealIndexPanelProps) {
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
