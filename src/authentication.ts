import { User } from "@prisma/client";
import { prismaClient } from "./resources";

export default async function (token: string): Promise<{
  success: boolean;
  user: User | null;
  response: string | null;
}> {
  if (token === undefined || !token)
    return { success: false, user: null, response: "No token provided." };

  // Grab the user from their access token
  const auth = await prismaClient.accessToken.findUnique({
    where: {
      access_token: token,
    },
    include: {
      user: true,
    },
  });
  // If the auth is invalid, return an error
  if (!auth)
    return { success: false, user: null, response: "Invalid authentication." };
  // If the auth is valid, return the user
  return { success: true, user: auth.user as unknown as User, response: null };
}
