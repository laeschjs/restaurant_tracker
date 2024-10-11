import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { OutlinedInput, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Select from "react-select";
import { useState } from "react";
import dayjs from "dayjs";

import type { Dayjs } from "dayjs";

const InputAdornment = styled("div")`
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export async function loader() {
  return json({
    themeParks: [
      { id: "2", name: "Magic Kingdom" },
      { id: "3", name: "Animal Kingdom" },
      { id: "4", name: "Epcot" },
      { id: "5", name: "Hollywood Studios" },
      { id: "6", name: "Universal" },
      { id: "7", name: "Sea World" },
    ],
  });
}

export default function NewVisit() {
  const { themeParks } = useLoaderData();
  // Once a visit has been started (no departure date), then this is the page that auto loads
  // and the other pages are not accessible until the visit is completed.
  const themeParkOptions = themeParks.map((park: any) => ({
    label: park.name,
    value: park.id,
  }));
  const [start, setStart] = useState<Dayjs | null>(dayjs());
  const [end, setEnd] = useState<Dayjs | null>(null);
  return (
    <div className="min-h-screen bg-sky-300 sm:flex sm:items-center sm:justify-center">
      <Paper className="p-16">
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Theme Park: </span>
          <Select name="theme_park" options={themeParkOptions} isSearchable />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Arrival: </span>
          <DateTimePicker
            className="col-span-3"
            value={start}
            onChange={(newValue) => setStart(newValue)}
            disableFuture
          />
          <input
            className="hidden"
            name="start"
            value={start?.toISOString()}
            onChange={() => ""}
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Departure: </span>
          <DateTimePicker
            className="col-span-3"
            value={end}
            onChange={(newValue) => setEnd(newValue)}
          />
          <input
            className="hidden"
            name="end"
            value={end?.toISOString()}
            onChange={() => ""}
          />
        </label>
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Day Ticket Price: </span>
          <OutlinedInput
            name="day_ticket_price"
            className="col-span-3"
            startAdornment={<InputAdornment>$</InputAdornment>}
            defaultValue={0}
          />
        </label>
      </Paper>
    </div>
  );
}
