import { pool } from "../../db";
import { IUpdateUser, Iuser } from "./user.interface";

const createUserIntoDB = async (payLoad: Iuser) => {
  const { name, email, password, age } = payLoad;
  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *
    `,
    [name, email, password, age],
  );
  return result;
};

const getUsersFromDB = async () => {
  const result = await pool.query(`
SELECT * FROM users 
            `);
  return result;
};

const getUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE id=$1
        `,
    [id],
  );
  return result;
};

const updateUserFromDB = async (
  payLoad: IUpdateUser,
  id: string
) => {
  const { name, age, password, is_active } = payLoad;

  const result = await pool.query(
    `
      UPDATE users
      SET
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        password = COALESCE($3, password),
        is_active = COALESCE($4, is_active),
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `,
    [name ?? null, age ?? null, password ?? null, is_active ?? null, id]
  );

  return result;
};

const deleteUserFromDB  = async (id:string) =>{
    const result = await pool.query(`
DELETE FROM USERS WHERE id=$1
        `,[id]);
        return result;
}
export const userService = {
  createUserIntoDB,
  getUsersFromDB,
  getUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
};
