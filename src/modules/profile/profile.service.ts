import { pool } from "../../db";

const createProfileIntoDb = async(payLoad : any)=>{
    const {user_id,bio,address,phone,gender} = payLoad;

    //if the user id from profile table doesnt match w any of the user's the id from the users table
const user = await pool.query(
    `
    SELECT * FROM users WHERE id=$1
    `
,[user_id]);
if(user.rowCount===0){
    throw new Error("User doesnt exist in the DB!")
}


  const result = await pool.query(
    `
    INSERT INTO profile(user_id,bio,address,phone,gender) VALUES($1,$2,$3,$4,$5) RETURNING *
    `,
    [user_id,bio,address,phone,gender],
  );
  return result;
}
export const profileService = {
    createProfileIntoDb,
}