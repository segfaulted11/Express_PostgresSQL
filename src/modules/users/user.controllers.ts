import { Request, Response } from "express";
import { userService } from "./user.services";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "USER CREATED",
      data: result?.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsersFromDB();
    res.status(201).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserFromDB(id as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User doesnt exist!",
      });
    }
    res.status(201).json({
      success: true,
      message: "Data from the particular user",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await userService.updateUserFromDB(
      req.body,
      id as string
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};

const deleteUser = async(req: Request, res: Response)=>{
try {
    const {id} = req.params;

    const result = await userService.deleteUserFromDB(id as string)

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
}

export const userController = { createUser, getUsers, getUserById, updateUser,deleteUser };
