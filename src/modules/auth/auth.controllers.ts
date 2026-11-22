import { Request, Response } from "express";
import { authService } from "./auth.services";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.logInUserIntoDB(req.body);

    return res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      data: result,
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
};
export const authController = {
    loginUser
}