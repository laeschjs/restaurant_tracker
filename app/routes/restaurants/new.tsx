import { Form } from "@remix-run/react";

export default function NewMealPage() {
  return (
    <div className="mx-auto flex max-w-lg">
      <Form method="post" className="w-full rounded-md bg-white p-5 shadow-lg">
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Dish: </span>
          <input
            name="dish"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Notes: </span>
          <input
            name="notes"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Rating: </span>
          <input
            name="rating"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
            type="number"
            min="1"
            max="10"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Cost: </span>
          <input
            name="cost"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Reservation: </span>
          <div className="col-span-3 grid grid-cols-4">
            <div className="col-span-1 col-start-2">
              <input
                name="reservation"
                type="radio"
                id="reservation_yes"
                className="mr-2"
                value="true"
              />
              <label htmlFor="reservation_yes">YES</label>
            </div>
            <div className="col-span-1 col-start-3">
              <input
                name="reservation"
                type="radio"
                id="reservation_no"
                className="mr-2"
                value="false"
              />
              <label htmlFor="reservation_no">NO</label>
            </div>
          </div>
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Wait Time: </span>
          <input
            name="queueTime"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <button
          type="submit"
          className="mt-5 rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
