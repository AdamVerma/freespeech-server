import { Project, Tile, TilePage, User } from "@prisma/client";
import express from "express";
import { prismaClient } from "../resources";

const router = express.Router();

type ProjectResponse = {
  url: string | null;
  id: string | null;
  error: string | null;
  project:
    | (Project & { author: User; pages: TilePage[] & { tiles: Tile[] }[] })
    | null;
};

router.post<{}, ProjectResponse>("/create", async (req, res) => {
  // get request body
  const { name, description } = req.body;
  // If no name is provided, return an error
  if (!name) {
    return res.status(400).json({
      url: null,
      id: null,
      project: null,
      error: "Missing name",
    });
  }
  // Create a slug
  const slug =
    name
      .replace(/ /g, "-")
      .replace(/[^a-z0-9-]/gi, "")
      .toLowerCase() +
    "-" +
    Math.floor(Math.random() * 100000);
  // Create a project
  const project: Project = await prismaClient.project.create({
    data: {
      name: name + "",
      description: description + "",
      slug,
      author: {
        connect: {
          id: (req as unknown as { user: any }).user.id,
        },
      },
      pages: {
        create: {
          name: "Home",
          user: {
            connect: {
              id: (req as unknown as { user: any }).user.id,
            },
          },
          tiles: {
            create: {
              tile_index: 0,
              display_text: "First tile!",
              author: {
                connect: {
                  id: (req as unknown as { user: any }).user.id,
                },
              },
            },
          },
        },
      },
    },
  });
  return res.status(200).json({
    url: `/project/${project.slug}`,
    id: project.id,
    error: null,
    project: null,
  });
});

router.post<{}, ProjectResponse>("/get", async (req, res) => {
  // get request body
  const { id, slug } = req.body;
  // If no id or slug is provided, return an error
  if (!id && !slug) {
    return res.status(400).json({
      url: null,
      id: null,
      error: "Missing id or slug",
      project: null,
    });
  }
  // Get a project given the id or slug
  let project:
    | (Project & { author: User; pages: TilePage[] & { tiles: Tile[] }[] })
    | null = null;

  // if the id is provided, fetch the project by id
  if (id) {
    project = await prismaClient.project.findUnique({
      where: {
        id: id + "",
      },
      include: {
        author: true,
        pages: {
          include: {
            tiles: true,
          },
        },
      },
    });
    // if the slug is provided, fetch the project by slug
  } else {
    project = await prismaClient.project.findUnique({
      where: {
        slug: slug + "",
      },
      include: {
        author: true,
        pages: {
          include: {
            tiles: true,
          },
        },
      },
    });
  }
  // if there is no project, return an error
  if (!project) {
    return res.status(404).json({
      url: null,
      id: null,
      error: "Project not found",
      project: null,
    });
  }
  // if the project is not public or the user is not the author, return an error
  if (
    project.userId !== (req as unknown as { user: any }).user.id &&
    !project.public
  ) {
    return res.status(403).json({
      url: null,
      id: null,
      error: "Project is private",
      project: null,
    });
  }
  // return the project
  return res.status(200).json({
    url: `/project/${project.slug}`,
    id: project.id,
    error: null,
    project,
  });
});

router.post<{}, ProjectResponse>("/update", async (req, res) => {
  // get request body
  const { id, name, description, isPublic, columns } = req.body;
  // If no id is provided, return an error
  if (!id) {
    return res.status(400).json({
      url: null,
      id: null,
      error: "Missing id",
      project: null,
    });
  }
  // Get a project given the id
  const project: Project | null = await prismaClient.project.findUnique({
    where: {
      id: id + "",
    },
  });
  // if there is no project, return an error
  if (!project) {
    return res.status(404).json({
      url: null,
      id: null,
      error: "Project not found",
      project: null,
    });
  }
  // if the user is not the author, return an error
  if (project.userId !== (req as unknown as { user: any }).user.id) {
    return res.status(403).json({
      url: null,
      id: null,
      error: "You are not the author of this project",
      project: null,
    });
  }
  // update the project
  const updatedProject: Project = await prismaClient.project.update({
    where: {
      id: id + "",
    },
    data: {
      name: name + "" || project.name,
      description: description + "" || project.description,
      public: isPublic === "true" || isPublic === true || project.public,
      columns: parseInt(columns + "") || project.columns,
    },
  });
  // return the project
  return res.status(200).json({
    url: `/project/${updatedProject.slug}`,
    id: updatedProject.id,
    error: null,
    project: null,
  });
});

export default router;
