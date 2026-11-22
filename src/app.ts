import express, { Application, Request, Response } from "express";
import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";

const app: Application = express(); //creating the backend server
// const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// First Route
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

//connecting the sub-router w the main router
app.use("/v1/api/users",userRoute);



//GET METHOD (getting all users data from the database)
app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    //retrieving the data from the data -
    const result = await pool.query(`
SELECT * FROM users 
            `);
    // console.log(result);//inside the Result object, in the 'rows' array, it stores the collection of all users, as an individual object for each that user's data thats on the database(sent by the client[postman]) 
        res.status(201).json({
      success: true,
      message: 'users retrieved successfully',
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

//GET METHOD (getting a particular user data from the database)
app.get("/api/v1/users/:id",async(req: Request, res: Response)=>{
try {
    const {id} = req.params;
    const result =await pool.query(`
        SELECT * FROM users WHERE id=$1
        `,[id]);
        // console.log(result);//it returns the particular object of which id matches w the requested id.
                   if(result.rowCount===0){
            res.status(404).json({
                success : false,
                message : "User doesnt exist!"
            })
        }
res.status(201).json({
    success : true,
    message : "Data from the particular user",
    data : result.rows
})
} catch (error:any) {
    res.status(500).json({
         success: false,
      message: error?.message,
      error: error,
    })
}
})

//PUT METHOD (updating the data(any property) for an user from the database)
app.put("/api/v1/users/:id",async(req: Request, res: Response)=>{
try {
    const {id} = req.params;
    const {name,age,password,is_active} = req.body;
    const result = await pool.query(`
        UPDATE users
        SET
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        password = COALESCE($3, password),
        is_active = COALESCE($4, is_active),
        updated_at = NOW()
        WHERE id=$5 RETURNING *
        `,[name?? null, age?? null, password?? null, is_active?? null,id])
    // console.log(result);//in the 'rows', you will see the updated values for wht u updated.
            if(result.rowCount===0){
            res.status(404).json({
                success : false,
                message : "User doesnt exist!"
            })
        }
    res.status(201).json({
           success: true,
      message: 'user updated successfully',
      data: result.rows,
    })
}catch (error:any) {
    res.status(500).json({
         success: false,
      message: error?.message,
      error: error,
    })
}
})

//DELETE METHOD (deleting an user from the database)
app.delete("/api/v1/users/:id",async(req: Request, res: Response)=>{
try {
    const {id} = req.params;
    const result = await pool.query(`
DELETE FROM USERS WHERE id=$1
        `,[id]);
        // console.log(result);//returns an empty array in 'rows' means theres no user as its deleted. and rowCount is 0.
        if(result.rowCount===0){
            res.status(404).json({
                success : false,
                message : "User either doesnt exist or already deleted!"
            })
        }
        res.status(201).json({
            success : true,
            message : "user deleted successfully",
            data : result.rows
        })
} catch (error:any) {
    res.status(500).json({
         success: false,
      message: error?.message,
      error: error,
    })
}
})

export default app;