import express, { Application, Request, Response } from "express";
import { userRoute } from "./modules/users/user.routes";
import { profileRouter } from "./modules/profile/profile.routes";
import { authRoute } from "./modules/auth/auth.routes";
import fs  from "fs";
import logger from "./middleware/logger";

const app: Application = express(); //creating the backend server

// Middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

/*
Logger middleware is used to keep track of incoming requests to a server. In Express.js, it helps us monitor what is happening in our application.
Think of logger middleware as a record keeper for your server. It keeps a history of incoming requests so developers can monitor and debug their applications easily.
*/

// Custom Logger middleware to track incoming requests
app.use(logger);


// root Route
app.get("/", (req: Request, res: Response) => {
  //GET is the request coming from the client to the server. And res.send(), res.json() is the response from the server to client.
  // res.send("hello")
  res.json({
    success: true,
    message: "this is root route",
  });
});



//*********modular pattern******** ->
//handle router -> user.router.ts
//handle request/ response -> user.controller.ts
//hanlde database query logic ->  user.service.ts

//connecting the sub-routers of the 'users' feature w the main router
app.use("/v1/api/users",userRoute);

/* how this is connected :
user.routes.ts -> 
*/

//connecting the 'profile' feature to the main router 
app.use("/api/v1/profiles", profileRouter);

app.use("/api/v1/auth",authRoute)

export default app;