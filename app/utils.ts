import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import type { Prisma } from "@prisma/client";

import type { User } from "~/models/user.server";
import type { Dayjs } from "dayjs";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

type RestaurantCuisineMapperWithRels =
  Prisma.RestaurantCuisineMapperGetPayload<{
    include: { cuisine: true };
  }>;

interface IRestaurantOrCuisine {
  id: string;
  name: string;
  cuisines?: RestaurantCuisineMapperWithRels[];
  restaurants?: RestaurantCuisineMapperWithRels[];
}

export interface ISelectOption {
  label: string;
  value: string;
  obj: IRestaurantOrCuisine;
}

export function makeOptions(
  valueKey?: string
): (obj: IRestaurantOrCuisine) => ISelectOption {
  return (obj: IRestaurantOrCuisine) => {
    let value = obj.name;
    if (valueKey === "id") {
      value = obj.id;
    }
    return { label: obj.name, value, obj: obj };
  };
}

export function formatDate(date: Dayjs) {
  return date.format("YYYY-MM-DD");
}
