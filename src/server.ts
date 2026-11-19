import express, { Application, Request, Response } from "express";
import { Pool } from "pg";
import config from "./config";
const app: Application = express(); //creating the backend server
// const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connecting the server w the database
const pool = new Pool({
  connectionString:config.connection_string,
});

//initialzing the database :
const initDatabase = async () => {
  try {
    // creating a table named 'users' in the database
    await pool.query(`
CREATE TABLE IF NOT EXISTS users(
id SERIAL PRIMARY KEY,
name VARCHAR(255),
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
age INT,
is_active BOOLEAN DEFAULT true,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);
            `);
    console.log("database connected successfully!");
  } catch (error) {
    console.log(error);
  }
};
initDatabase();

// First Route
app.get("/", (req: Request, res: Response) => {
  //GET is the request coming from the client to the server. And res.send(), res.json() is the response from the server to client.
  // res.send("hello")
  res.json({
    success: true,
    message: "this is root route",
  });
});

//POST Method(creating user(s) and storing it on the 'users' database and showing the created user as response)
app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    // req.body contains data sent by the client (here it contains the json data that u sent using POSTMAN)
    const body = req.body;
    const { name, email, password, age, is_active, created_at, updated_at } =
      body;

    // creating/inserting an user data for the users table that was created above for the database.
    const result = await pool.query(
      `
    INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *
    `,
      [name, email, password, age],
    );
    //console.log(result); //in the 'rows' array within the 'Result' object, it returns the json data u sent by postman for an user(for the user u sent the request for) and since u mentioned 'RETURNING *' thats why its gonna put the entire json in the rows for showing in the response. however, if u hadnt used it, it would just create an user and insert it on the table of the database but it would not return anything.

    res.status(201).json({
      success: true,
      message: "USER CREATED",
      data: result?.rows[0],
    }); //you will see this response on the postman after clicking the send btn.
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
});

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

// Start server
app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
