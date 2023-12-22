"use server";
import { connectToDatabase } from "../mongoose";
import User from "@/database/User.model";
export async function getUserById(params: any) {
  try {
    connectToDatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log("DEBUG: Error getting user by id", error);
  }
}
