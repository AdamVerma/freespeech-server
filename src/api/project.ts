import { Project, Tile, TilePage, User } from "@prisma/client";
import express from "express";
import { ProjectWhole, ProjectWholeNoAuthor } from "../interfaces/Project";
import { prismaClient } from "../resources";

const router = express.Router();

type ProjectResponse = {
  url: string | null;
  id: string | null;
  error: string | null;
  project: ProjectWhole | null;
};

const generateSlug = (name: String) => {
  return (
    name
      .replace(/ /g, "-")
      .replace(/[^a-z0-9-]/gi, "")
      .toLowerCase() +
    "-" +
    Math.floor(Math.random() * 100000)
  );
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
  const slug = generateSlug(name);
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

  // if the project is cloned
  if (project.cloned_from) {
    // get the original project
    const originalProject = await prismaClient.project.findUnique({
      where: {
        id: project.cloned_from,
      },
      include: {
        pages: {
          include: {
            tiles: true,
          },
        },
      },
    });
    // if the original project is not found, return an error
    if (!originalProject) {
      return res.status(404).json({
        url: null,
        id: null,
        error: "Original project not found",
        project: null,
      });
    }
    // if the original project is not public or the user is not the author, return an error
    if (
      originalProject.userId !== (req as unknown as { user: any }).user.id &&
      !originalProject.public
    ) {
      return res.status(403).json({
        url: null,
        id: null,
        error: "Original project is private",
        project: null,
      });
    }
    // replace the pages with the original project's pages but
    // merge the tiles with the cloned project's tiles
    const tempPages = [...project.pages];
    project.pages = originalProject.pages.map((page) => {
      const tempPage = tempPages.find((p) => p.id === page.id);
      if (tempPage) {
        return {
          ...page,
          ...tempPage,
          tiles: [...page.tiles, ...tempPage.tiles],
        };
      }
      return page;
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
  const { id, name, description, isPublic, columns, image } = req.body;
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
      name: name || project.name,
      image: image || project.image,
      description: description || project.description,
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

router.post<{}, ProjectResponse>("/delete", async (req, res) => {
  // get request body
  const { id } = req.body;
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
  // delete the project
  await prismaClient.project.delete({
    where: {
      id: id + "",
    },
  });
  // return the project
  return res.status(200).json({
    url: null,
    id: null,
    error: null,
    project: null,
  });
});

router.post<{}, ProjectResponse>("/clone", async (req, res) => {
  // get request body
  const { id } = req.body;
  // If no id is provided, return an error
  if (!id) {
    return res.status(400).json({
      url: null,
      id: null,
      error: "Missing id",
      project: null,
    });
  }
  // Get project
  const project = await prismaClient.project.findUnique({
    where: {
      id: id + "",
    },
    include: {
      pages: {
        include: {
          tiles: true,
        },
      },
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
  // if the project is not public or the user is not the author, return an error
  if (
    !project.public &&
    project.userId !== (req as unknown as { user: User }).user.id
  ) {
    return res.status(403).json({
      url: null,
      id: null,
      error: "Project is private",
      project: null,
    });
  }

  // create a new project
  const newProject: Project = await prismaClient.project.create({
    data: {
      name: project.name,
      description: project.description,
      public: false,
      columns: project.columns,
      cloned_from: project.id,
      author: {
        connect: {
          id: (req as unknown as { user: User }).user.id,
        },
      },
    },
  });

  // return the project
  return res.status(200).json({
    url: `/project/${newProject.slug}`,
    id: newProject.id,
    error: null,
    project: null,
  });
});

export default router;
