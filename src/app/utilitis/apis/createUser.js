import { client } from "../../../sanity/client";
import bcrypt from 'bcryptjs';

const saltRounds = 10;
  
async function hashPassword(plainPassword) {
  try {
    const hash = await bcrypt.hash(plainPassword, saltRounds);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}


export async function createUser(data) {
    const hashedPassword = await hashPassword(data.password)
    const newUser = {
      _type: 'user',
      userName: data.username,
      email: data.email,
      password: hashedPassword
    };

    try {
      await client.create(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
}