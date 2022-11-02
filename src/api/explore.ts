import { TilePage, User, Project } from "@prisma/client";
import express from "express";
import { prismaClient } from "../resources";

const router = express.Router();

type ExploreResponse = {
  error: string | null;
  projects: Project[] | null;
};

// search
router.post<{}, ExploreResponse>("/create", async (req, res) => {
  const { searchStr } = req.body;
  // If no searchStr is provided, return an error
  if (!searchStr) {
    return res.status(400).json({
      error: "Missing searchStr",
      projects: null,
    });
  }
  // get the project
  const projects =
    (await prismaClient.project.findMany({
      where: {
        name: {
          search: searchStr,
        },
        description: {
          search: searchStr,
        },
        public: true,
      },
      include: {
        author: true,
      },
    })) || [];
  // If the project doesn't exist, return an error
  return res.status(200).json({
    error: null,
    projects,
  });
});

// explore with pagination
router.post<{}, ExploreResponse>("/explore", async (req, res) => {
  const { page } = req.body;
  // If no page is provided, return an error
  if (!page) {
    return res.status(400).json({
      error: "Missing page",
      projects: null,
    });
  }
  // get the project
  const projects =
    (await prismaClient.project.findMany({
      where: {
        public: true,
      },
      include: {
        author: true,
      },
      take: 10,
      skip: 10 * (page - 1),
    })) || [];
  // If the project doesn't exist, return an error
  return res.status(200).json({
    error: null,
    projects,
  });
});

export default router;
