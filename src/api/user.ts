import { Tile, User } from "@prisma/client";
import express from "express";
import { prismaClient } from "../resources";

const router = express.Router();

type UserResponse = {
  id: string | null;
  error: string | null;
};

// update
router.post<{}, UserResponse>("/update", async (req, res) => {
  const { userId, newUser } = req.body;
  // If no userId is provided, return an error
  if (!userId) {
    return res.status(400).json({
      id: null,
      error: "Missing userId",
    });
  }
  // If no name is provided, return an error
  if (!newUser) {
    return res.status(400).json({
      id: null,
      error: "Missing user",
    });
  }
  // get the user
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(400).json({
      id: null,
      error: "User not found",
    });
  }
  // if the user is not the author of the user, return an error
  if (user.id !== (req as unknown as { user: User }).user.id) {
    return res.status(400).json({
      id: null,
      error: "You don't have permission to do that",
    });
  }
  // Update a user
  const updatedUser: User = await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      ...newUser,
    },
  });
  // return the user id
  return res.status(200).json({
    id: updatedUser.id,
    error: null,
  });
});

// delete
router.post<{}, UserResponse>("/delete", async (req, res) => {
  const { userId } = req.body;
  // If no userId is provided, return an error
  if (!userId) {
    return res.status(400).json({
      id: null,
      error: "Missing userId",
    });
  }
  // get the user
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(400).json({
      id: null,
      error: "User not found",
    });
  }
  // if the user is not the author of the user, return an error
  if (user.id !== (req as unknown as { user: User }).user.id) {
    return res.status(400).json({
      id: null,
      error: "You don't have permission to do that",
    });
  }
  // Delete a user
  await prismaClient.user.delete({
    where: {
      id: userId,
    },
  });
  // return the user id
  return res.status(200).json({
    id: userId,
    error: null,
  });
});

export default router;
