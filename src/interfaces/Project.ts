import { Project, Tile, TilePage, User } from "@prisma/client";
export type ProjectWhole = Project & {
  author: User;
  pages: TilePage[] & { tiles: Tile[] }[];
};
export type ProjectWholeNoAuthor = Project & {
  pages: TilePage[] & { tiles: Tile[] }[];
};
