"use server";
import { connectToDatabase } from "../mongoose";
import User from "@/database/User.model";
import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
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

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log("DEBUG: Error creating user", error);
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log("DEBUG: Error updating user", error);
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // delete user from database
    // this includes questions, answers, and comments, etc

    //get user question ids

    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    //delete user questions

    await Question.deleteMany({ author: user._id });

    //TODO: delete user answers, comments and etc...

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log("DEBUG: Error deleting user", error);
  }
}