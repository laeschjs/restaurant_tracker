import { Form, Link, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

import { addFriend, getFriends } from "~/models/friend.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

import type { ActionArgs, LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const friends = await getFriends({ userId });
  return json({ friends });
}

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();

  await addFriend({
    friendId: `${formData.get("friend_id")}`,
    userId,
  });

  return redirect("/app/friends");
}

export default function FriendsPage() {
  const user = useUser();
  const data = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-5 max-w-lg">
      Your ID: {user.id}
      <Form
        method="post"
        className="mt-5 w-full rounded-md bg-white p-5 shadow-lg"
        reloadDocument
      >
        <label className="my-3 flex grid grid-cols-4 items-center gap-1">
          <span className="col-span-1">Friend's ID: </span>
          <input
            name="friend_id"
            className="col-span-3 rounded-md border-2 border-sky-500 px-3 leading-loose"
          />
        </label>
        <button
          type="submit"
          className="mt-5 rounded bg-sky-500 py-2 px-4 text-white hover:bg-sky-600 focus:bg-sky-400"
        >
          Save
        </button>
        <Link to="/app/meals" className="mt-5 ml-5 text-pink-400">
          Cancel
        </Link>
      </Form>
      <div className="mt-5">
        <div>Your Friends:</div>
        {data.friends.map((fr) => {
          return <div key={fr.email}>{fr.email}</div>;
        })}
      </div>
    </div>
  );
}
