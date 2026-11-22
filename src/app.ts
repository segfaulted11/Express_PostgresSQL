import express, { Application, Request, Response } from "express";
import { userRoute } from "./modules/users/user.routes";

const app: Application = express(); //creating the backend server

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

//connecting the sub-routers w the main router
app.use("/v1/api/users",userRoute);


export default app;