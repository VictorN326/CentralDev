"use server";

import { CreateAnswerParams } from "./shared.types";
import { connectToDatabase } from "../mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();
    const { content, author, question, path } = params;
    const newAnswer = new Answer({ content, author, question });

    // Ad answer to question's array

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    revalidatePath(path);
    //TODO: Add interaction for later usage of user reputation
  } catch (error) {
    console.log("DEBUG: error creating answer: ", error);
  }
}
