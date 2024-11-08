import { prisma } from "~/db.server";

import type { ThemeParkVisit } from "@prisma/client";

interface ThemeParkVisitParam {
  start: ThemeParkVisit["start"];
  themeParkId: ThemeParkVisit["themeParkId"];
  dayTicketPrice: ThemeParkVisit["dayTicketPrice"];
  userId: string;
}

export async function createThemeParkVisit({
  start,
  themeParkId,
  dayTicketPrice,
  userId,
}: ThemeParkVisitParam) {
  return await prisma.themeParkVisit.create({
    data: {
      start,
      themeParkId,
      dayTicketPrice,
      users: { connect: { id: userId } },
    },
  });
}

export async function getActiveThemeParkVisits({ userId }: { userId: string }) {
  return await prisma.themeParkVisit.findMany({
    where: {
      end: null,
      users: { some: { id: userId } },
    },
  });
}

export async function endThemeParkVisit({
  id,
  endTime,
}: {
  id: string;
  endTime: Date;
}) {
  return await prisma.themeParkVisit.update({
    where: { id },
    data: { end: endTime },
  });
}
