import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getFriends({ userId }: { userId: User["id"] }) {
  const friendMappers = await prisma.friendMapper.findMany({
    where: { selfId: userId },
    include: { friend: true },
  });
  return friendMappers.map((fm) => fm.friend);
}

export async function addFriend({
  friendId,
  userId,
}: {
  friendId: User["id"];
  userId: User["id"];
}) {
  const friend = await prisma.friendMapper.findFirst({
    where: { selfId: userId, friendId },
  });
  if (!friend) {
    await prisma.friendMapper.create({
      data: { friendId, selfId: userId },
    });
    await prisma.friendMapper.create({
      data: { friendId: userId, selfId: friendId },
    });
  }
}
