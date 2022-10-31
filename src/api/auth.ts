import { prismaClient } from "../resources";
import express from "express";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import isEmail from "isemail";

const router = express.Router();

type AuthResponse = {
  access_token: string | null;
  error: string | null;
};

// Creates an access token for a user
const createAccessToken = async (user: User) => {
  return (
    await prismaClient.accessToken.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    })
  ).access_token;
};

// Create Account
router.post<{}, AuthResponse>("/create", async (req, res) => {
  // Grab the request body
  const { email, password, name } = req.body;

  // Check if the email is valid
  if (!isEmail.validate(email)) {
    return res.status(400).json({
      access_token: null,
      error: "Invalid email",
    });
  }

  // Check if the password is valid
  if (password.length < 1) {
    return res.status(400).json({
      access_token: null,
      error: "No password",
    });
  }

  // Check if the email has been taken
  const existingUser = await prismaClient.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser)
    return res.status(400).json({
      access_token: null,
      error: "Email already taken",
    });

  // Hash the password
  const hash = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prismaClient.user.create({
    data: {
      identifier_token: email + "",
      email: email + "",
      name: name + "",
      hashed_password: hash + "",
    },
  });
  if (!user)
    return res
      .status(400)
      .json({ error: "User not created.", access_token: null });

  // Create the access token
  const accessToken = await createAccessToken(user);
  if (!accessToken)
    res
      .status(400)
      .json({ error: "Access token not created.", access_token: null });

  // Send the access token to the client
  return res.status(200).json({ error: null, access_token: accessToken });
});

// Login
router.post<{}, AuthResponse>("/login", async (req, res) => {
  // Grab the request body
  const { email, password } = req.body;

  // Find the user
  const user = await prismaClient.user.findUnique({
    where: {
      email: email + "",
    },
  });
  if (!user)
    return res.status(400).json({
      access_token: null,
      error: "User not found",
    });

  // Check the password
  const passwordCorrect = await bcrypt.compare(
    password,
    user!.hashed_password!
  );
  if (!passwordCorrect)
    return res
      .status(400)
      .json({ error: "Incorrect password.", access_token: null });

  // Create the access token
  const accessToken = await createAccessToken(user!);
  if (!accessToken)
    return res
      .status(400)
      .json({ error: "Access token not created.", access_token: null });

  // Send the access token to the client
  return res.status(200).json({ error: null, access_token: accessToken });
});

export default router;
