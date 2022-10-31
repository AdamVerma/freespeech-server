import { NextFunction, Request, Response } from "express";

import ErrorResponse from "./interfaces/ErrorResponse";
import Authentication from "./authentication";

// Authentcation
export function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Grab the access token from the request
  const token = req.headers.authorization;

  // Get the authentication status of the token
  const authenticationStatus = Authentication(token + "");
  if (!authenticationStatus.success) {
    next();
  } else {
    // Delete the hashed password from the user object
    delete (authenticationStatus as { user: { hashed_password?: string } }).user
      .hashed_password;

    // Add the user to the request object
    (req as unknown as { user: any }).user = authenticationStatus.user;

    // Continue to the next function
    next();
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
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
