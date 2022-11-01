import { NextFunction, Request, Response } from "express";
import Authentication from "./authentication";

// auth middleware
export async function handleAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // routes that dont require auth
  const noAuthRoutes = ["auth"];

  // if the subroute is in the no auth needed routes, continue
  const subroute = req.url.split("/")[3].toLowerCase();
  if (!req.headers.authorization && noAuthRoutes.includes(subroute)) {
    next();
    return;
  }

  // Grab the access token from the request
  const token = req.headers.authorization?.split(" ")[1];
  // Get the authentication status of the token
  const authenticationStatus = await Authentication(token + "");

  if (authenticationStatus.success) {
    // Delete the hashed password from the user object
    delete (authenticationStatus as { user: { hashed_password?: string } }).user
      .hashed_password;

    // Add the user to the request object
    (req as unknown as { user: any }).user = authenticationStatus.user;
    // Continue to the next middleware
    next();
  } else {
    // Send the error response
    res.status(401).send({ error: authenticationStatus.response });
  }
}

// 404 handler
export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// Backend Error handler
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<{ message: string; stack?: string }>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
