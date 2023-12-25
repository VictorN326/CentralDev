"use server";

import Tag from "@/database/Tag.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";

import {
  CreateQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
} from "./shared.types";
import User from "@/database/User.model";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag }) // need to populate the tags reference to get the tag name or value
      .populate({ path: "author", model: User }) // need to populate the author reference to get the author's name or value
      .sort({ createdAt: -1 });
    return { questions };
  } catch (error) {
    console.log("DEBUG: Error getting questions", error);
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    // create the question

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocument = [];

    //create the tags or get them if they exist already
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocument.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocument } },
    });

    // create a record for the user's ask question action

    // Increment author's reputation by +5 for creating a question

    revalidatePath(path);
    console.log("DEBUG:PATH", path);
    return { question };
  } catch (error) {}
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" }) // need to populate the tags reference to get the tag name or value
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      }); // need to populate the author reference to get the author's name or value

    return question;
  } catch (error) {
    console.log("DEBUG: Error getting question by id", error);
  }
}
