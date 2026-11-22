import bcrypt from "bcryptjs";
import { pool } from "../../db";
import { IAuth } from "./auth.interface";
import jwt from "jsonwebtoken";

const logInUserIntoDB = async (payLoad: IAuth) => {
  //check if the user exists, password matches and the user status. if all is passed, the generate JWT token.

  const { email, password } = payLoad;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );

  //checking if the user exists
  if (!user.rows[0]) {
    throw new Error("this user doesnt exist!");
  }
  //checking if the password matches
  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new Error("invalid password!");
  }
  if (!user.rows[0].is_active) {
    throw new Error("user isnt active!");
  }
  const jwtPayLoad = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
  };
  const accessToken = jwt.sign(jwtPayLoad, "gshsdgdhdvwwsffsyci", {
    expiresIn: "1d",
  });
  return {accessToken,user : user.rows[0]};
};

export const authService = {
  logInUserIntoDB,
};
