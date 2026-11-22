import { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = async (req: Request, res: Response, next: NextFunction) => {
  // Create a log message containing the request method, URL, and current timestamp
  const log = `\nMethod : ${req.method} | URL : ${req.url} | Time : ${Date.now()}\n`;

  // Append the log message to the logger.txt file (writes the log msg to the logger.txt every time theres a rquest)
  fs.appendFile("logger.txt", log, (err) => console.log(err));

  // Move to the next middleware or route handler
  next();
};
export default logger;
