import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

export async function loader() {
  return json({ hello: "world" });
}

export default function Index() {
  const { hello } = useLoaderData();
  return (
    <>
      <div>{hello}</div>
    </>
  );
}
