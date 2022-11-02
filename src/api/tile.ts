import { Tile, User } from "@prisma/client";
import express from "express";
import { prismaClient } from "../resources";

const router = express.Router();

type TileResponse = {
  id: string | null;
  error: string | null;
};

// create
router.post<{}, TileResponse>("/create", async (req, res) => {
  const { pageId, newTile } = req.body;
  // If no pageId is provided, return an error
  if (!pageId) {
    return res.status(400).json({
      id: null,
      error: "Missing pageId",
    });
  }
  // If no name is provided, return an error
  if (!newTile) {
    return res.status(400).json({
      id: null,
      error: "Missing tile",
    });
  }
  // get the page
  const page = await prismaClient.tilePage.findUnique({
    where: {
      id: pageId,
    },
  });
  // If the page doesn't exist, return an error
  if (!page) {
    return res.status(400).json({
      id: null,
      error: "Page not found",
    });
  }
  // if the user is not the author of the page, return an error
  if (page.user_id !== (req as unknown as { user: User }).user.id) {
    return res.status(400).json({
      id: null,
      error: "You don't have permission to do that",
    });
  }
  // Create a tile
  const tile: Tile = await prismaClient.tile.create({
    data: {
      ...newTile,
      TilePage: {
        connect: {
          id: pageId,
        },
      },
    },
  });
  // return the tile id
  return res.status(200).json({
    id: tile.id,
    error: null,
  });
});

// remove
router.post<{}, TileResponse>("/remove", async (req, res) => {
  const { tileId } = req.body;
  // If no tileId is provided, return an error
  if (!tileId) {
    return res.status(400).json({
      id: null,
      error: "Missing tileId",
    });
  }
  // get the tile
  const tile = await prismaClient.tile.findUnique({
    where: {
      id: tileId,
    },
  });
  // If the tile doesn't exist, return an error
  if (!tile) {
    return res.status(400).json({
      id: null,
      error: "Tile not found",
    });
  }
  // get the page
  const page = await prismaClient.tilePage.findUnique({
    where: {
      id: parseInt(tile.tilePageId + ""),
    },
  });
  // If the page doesn't exist, return an error
  if (!page) {
    return res.status(400).json({
      id: null,
      error: "Page not found",
    });
  }
  // if the user is not the author of the page, return an error
  if (page.user_id !== (req as unknown as { user: User }).user.id) {
    return res.status(400).json({
      id: null,
      error: "You don't have permission to do that",
    });
  }
  // delete the tile
  await prismaClient.tile.delete({
    where: {
      id: tileId,
    },
  });
  // return the tile id
  return res.status(200).json({
    id: tileId,
    error: null,
  });
});

// update
router.post<{}, TileResponse>("/update", async (req, res) => {
  const { tileId, newTile } = req.body;
  // If no tileId is provided, return an error
  if (!tileId) {
    return res.status(400).json({
      id: null,
      error: "Missing tileId",
    });
  }
  // If no name is provided, return an error
  if (!newTile) {
    return res.status(400).json({
      id: null,
      error: "Missing tile",
    });
  }
  // get the tile
  const tile = await prismaClient.tile.findUnique({
    where: {
      id: tileId,
    },
  });
  // If the tile doesn't exist, return an error
  if (!tile) {
    return res.status(400).json({
      id: null,
      error: "Tile not found",
    });
  }
  // get the page
  const page = await prismaClient.tilePage.findUnique({
    where: {
      id: parseInt(tile.tilePageId + ""),
    },
  });
  // If the page doesn't exist, return an error
  if (!page) {
    return res.status(400).json({
      id: null,
      error: "Page not found",
    });
  }
  // if the user is not the author of the page, return an error
  if (page.user_id !== (req as unknown as { user: User }).user.id) {
    return res.status(400).json({
      id: null,
      error: "You don't have permission to do that",
    });
  }
  // update the tile
  await prismaClient.tile.update({
    where: {
      id: tileId,
    },
    data: {
      ...newTile,
    },
  });
  // return the tile id
  return res.status(200).json({
    id: tileId,
    error: null,
  });
});

export default router;
