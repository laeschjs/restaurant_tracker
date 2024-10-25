import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { OutlinedInput, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Select from "react-select";
import { useState } from "react";
import dayjs from "dayjs";

import { getThemeParks } from "~/models/themePark.server";
import ThemeParkContinueButton from "~/components/ThemeParkContinueButton";
import { requireUserId } from "~/session.server";
import { createThemeParkVisit } from "~/models/themeParkVisit.server";

import type { Dayjs } from "dayjs";
import type { ActionArgs } from "@remix-run/node";

const InputAdornment = styled("div")`
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export async function loader() {
  const themeParks = await getThemeParks();
  return json({ themeParks });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const { id } = await createThemeParkVisit({
    start: new Date(`${values.start}`),
    themeParkId: `${values.themeParkId}`,
    dayTicketPrice: parseFloat(`${values.dayTicketPrice}`),
    userId,
  });

  return redirect(`/parks/new_visit/${id}`);
}

export default function Index() {
  const { themeParks } = useLoaderData();
  const [pieceIndex, setPieceIndex] = useState(0);
  const [selectedThemeParkId, setSelectedThemeParkId] = useState<string | null>(
    null
  );
  const [start, setStart] = useState<Dayjs | null>(dayjs());
  const [dayTicketPrice, setDayTicketPrice] = useState<number | null>(null);
  const flowPieces = [
    {
      label: "Theme Park",
      name: "themeParkId",
      value: selectedThemeParkId,
      component: (
        <Select
          name="theme_park"
          className="mx-auto mb-9 w-full"
          options={themeParks.map((park: any) => ({
            label: park.name,
            value: park.id,
          }))}
          onChange={(selectedOption: { value: string } | null) =>
            setSelectedThemeParkId(selectedOption?.value || null)
          }
        />
      ),
    },
    {
      label: "Arrival",
      name: "start",
      value: start?.toISOString() || "",
      component: (
        <DateTimePicker
          className="mx-auto mb-9 w-full"
          value={start}
          onChange={(newValue) => setStart(newValue)}
          disableFuture
        />
      ),
    },
    {
      label: "Day Ticket Price",
      name: "dayTicketPrice",
      value: dayTicketPrice,
      component: (
        <OutlinedInput
          name="dayTicketPrice"
          className="mx-auto mb-9 w-full"
          startAdornment={<InputAdornment>$</InputAdornment>}
          defaultValue={0}
          onChange={(e) => setDayTicketPrice(Number(e.target.value))}
        />
      ),
    },
  ];

  // TODO: Once a visit has been started (no departure date), then this is the page that
  // auto loads and the other pages are not accessible until the visit is completed.

  const currentPiece = flowPieces[pieceIndex];
  return (
    <div className="min-h-screen sm:flex sm:items-center sm:justify-center">
      <Paper className="bg-sky-300 p-16">
        <div className="mx-auto mb-3 w-full text-3xl">{currentPiece.label}</div>
        {currentPiece.component}
        <Form method="post">
          <ThemeParkContinueButton
            currentValue={currentPiece.value}
            readyToSubmit={pieceIndex === flowPieces.length - 1}
            onClick={
              currentPiece.value
                ? () => setPieceIndex(pieceIndex + 1)
                : undefined
            }
          />
          {flowPieces.map((piece) =>
            piece.value === null ? (
              ""
            ) : (
              <input
                key={piece.value}
                type="hidden"
                name={piece.name}
                value={piece.value}
              />
            )
          )}
        </Form>
      </Paper>
    </div>
  );
}
