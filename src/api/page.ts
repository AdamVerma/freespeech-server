import { TilePage, User } from "@prisma/client";
import express from "express";
import { prismaClient } from "../resources";

const router = express.Router();

type PageResponse = {
  id: number | null;
  error: string | null;
};

// create
router.post<{}, PageResponse>("/create", async (req, res) => {
  const { projectId, name } = req.body;
  // If no projectId is provided, return an error
  if (!projectId) {
    return res.status(400).json({
      id: null,
      error: "Missing projectId",
    });
  }
  // If no name is provided, return an error
  if (!name) {
    return res.status(400).json({
      id: null,
      error: "Missing name",
    });
  }
  // get the project
  const project = await prismaClient.project.findUnique({
    where: {
      id: projectId,
    },
  });
  // If the project doesn't exist, return an error
  if (!project) {
    return res.status(400).json({
      id: null,
      error: "Project not found",
    });
  }
  // if the user is not the author of the project, return an error
  if (project.userId !== (req as unknown as { user: User }).user.id) {
    return res.status(400).json({
      id: null,
      error: "You don't have permission to do that",
    });
  }
  // Create a page
  const page = await prismaClient.tilePage.create({
    data: {
      name,
      Project: {
        connect: {
          id: projectId,
        },
      },
      user: {
        connect: {
          id: (req as unknown as { user: User }).user.id,
        },
      },
    },
  });
  // if there was an error with creating the page, return an error
  if (!page) {
    return res.status(400).json({
      id: null,
      error: "Page not created",
    });
  }
  return res.status(200).json({
    id: page.id,
    error: null,
  });
});

// delete
router.post<{}, PageResponse>("/delete", async (req, res) => {
  const { pageId } = req.body;
  // If no pageId is provided, return an error
  if (!pageId) {
    return res.status(400).json({
      id: null,
      error: "Missing pageId",
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
  // get the project
  const project = await prismaClient.project.findUnique({
    where: {
      id: page.projectId + "",
    },
  });
  // If the project doesn't exist, return an error
  if (!project) {
    return res.status(400).json({
      id: null,
      error: "Project not found",
    });
  }
  // if the user is not the author of the project, return an error
  if (project.userId !== (req as unknown as { user: User }).user.id) {
    return res.status(400).json({
      id: null,
      error: "You don't have permission to do that",
    });
  }
  // delete the page
  const deletedPage: TilePage = await prismaClient.tilePage.delete({
    where: {
      id: pageId,
    },
  });
  // if there was an error with deleting the page, return an error
  if (!deletedPage) {
    return res.status(400).json({
      id: null,
      error: "Page not deleted",
    });
  }
  return res.status(200).json({
    id: deletedPage.id,
    error: null,
  });
});

// update
router.post<{}, PageResponse>("/update", async (req, res) => {
  const { pageId, name } = req.body;
  // If no pageId is provided, return an error
  if (!pageId) {
    return res.status(400).json({
      id: null,
      error: "Missing pageId",
    });
  }
  // If no name is provided, return an error
  if (!name) {
    return res.status(400).json({
      id: null,
      error: "Missing name",
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
  // get the project
  const project = await prismaClient.project.findUnique({
    where: {
      id: page.projectId + "",
    },
  });
  // If the project doesn't exist, return an error
  if (!project) {
    return res.status(400).json({
      id: null,
      error: "Project not found",
    });
  }
  // if the user is not the author of the project, return an error
  if (project.userId !== (req as unknown as { user: User }).user.id) {
    return res.status(400).json({
      id: null,
      error: "You don't have permission to do that",
    });
  }
  // update the page
  const updatedPage: TilePage = await prismaClient.tilePage.update({
    where: {
      id: pageId,
    },
    data: {
      name,
    },
  });
  // if there was an error with updating the page, return an error
  if (!updatedPage) {
    return res.status(400).json({
      id: null,
      error: "Page not updated",
    });
  }
  // return the updated page
  return res.status(200).json({
    id: updatedPage.id,
    error: null,
  });
});

export default router;
