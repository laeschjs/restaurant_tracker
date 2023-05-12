import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Form, Link } from "@remix-run/react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/system";
import Switch from "@mui/material/Switch";

import { makeOptions, ISelectOption } from "~/utils";

import type { Restaurant, Prisma } from "@prisma/client";

const InputAdornment = styled("div")`
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

interface MealFormProps {
  restaurants: Restaurant[];
  meal?: Prisma.MealGetPayload<{
    include: { restaurant: true };
  }>;
  isNew?: boolean;
  cancelFunc?: () => void;
}

export default function MealForm({
  restaurants,
  meal,
  isNew,
  cancelFunc,
}: MealFormProps) {
  let startingEatenAt = dayjs();
  let startingRestaurant = null;
  if (meal) {
    startingRestaurant = makeOptions("id")(meal.restaurant);
    startingEatenAt = dayjs(meal.eatenAt);
  }
  const [eatenAt, setEatenAt] = useState<Dayjs | null>(startingEatenAt);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<ISelectOption | null>(startingRestaurant);
  /*
    - The below link for reloadDocument also has a section on animating. Seems dumb I have to build it from
      scratch but would make it nice. Save it for a follow up
      EDIT maybe can just find existing react components like I did for react-select
  */
  return (
    <div className="mx-auto mt-5 flex max-w-lg">
      <Form
        id="new_restaurant"
        method="post"
        className="w-full rounded-md bg-white p-5 shadow-lg"
        //The line below https://remix.run/docs/en/v1/guides/data-writes and search
        reloadDocument
      >
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Restaurant: </span>
          <Select
            name="new_restaurant"
            value={selectedRestaurant}
            options={restaurants.map(makeOptions("id"))}
            onChange={(restaurant) => setSelectedRestaurant(restaurant)}
            isSearchable
            className="col-span-3"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Dish: </span>
          <TextField
            name="dish"
            className="col-span-3"
            defaultValue={meal?.dish}
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Notes: </span>
          <TextField
            name="notes"
            className="col-span-3"
            defaultValue={meal?.notes}
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Rating: </span>
          <Rating name="rating" defaultValue={meal?.rating} max={10} />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Cost: </span>
          <OutlinedInput
            name="cost"
            className="col-span-3"
            defaultValue={meal?.cost}
            startAdornment={<InputAdornment>$</InputAdornment>}
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Reservation: </span>
          <div className="col-span-3">
            No
            <Switch
              name="reservation"
              defaultChecked={meal?.reservation ?? false}
            />
            Yes
          </div>
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Wait Time: </span>
          <TextField
            name="queueTime"
            className="col-span-3"
            defaultValue={meal?.queueTime}
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">DateTime: </span>
          <DateTimePicker
            className="col-span-3"
            value={eatenAt}
            onChange={(newValue) => setEatenAt(newValue)}
            disableFuture
          />
          <input
            className="hidden"
            name="eatenAt"
            value={eatenAt?.format("L LTS")}
            onChange={() => ""}
          />
        </label>
        <input className="hidden" name="mealId" value={meal?.id} />
        <button
          type="submit"
          className="mt-5 rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Save
        </button>
        {cancelFunc ? (
          <button className="ml-5 text-pink-400" onClick={() => cancelFunc()}>
            Cancel
          </button>
        ) : (
          <Link to="/app/meals" className="mt-5 ml-5 text-pink-400">
            Cancel
          </Link>
        )}
      </Form>
    </div>
  );
}
