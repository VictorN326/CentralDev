"use server";

import Tag from "@/database/Tag.model";
import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
export async function createQuestion(params: any) {
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
  } catch (error) {}
}
