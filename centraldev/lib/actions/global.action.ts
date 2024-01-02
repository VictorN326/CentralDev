"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import Answer from "@/database/answer.model";
import User from "@/database/User.model";
import Tag from "@/database/Tag.model";

const searchableTypes = ["question", "answer", "user", "tag"];
export async function globalSearch(params: SearchParams) {
  try {
    connectToDatabase();
    const { query, type } = params;

    const regexQuery = { $regex: query, $options: "i" };

    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: User, searchField: "name", type: "user" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const typeLowerCase = type?.toLowerCase();

    if (!typeLowerCase || !searchableTypes.includes(typeLowerCase)) {
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);
        results.push(
          ...queryResults.map((result) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : result[searchField],
            type,
            id:
              type === "user"
                ? result.clerkId
                : type === "answer"
                  ? result.question
                  : result._id,
          }))
        );
      }
    } else {
      const modelInfo = modelsAndTypes.find(
        (modelInfo) => modelInfo.type === type
      );
      if (!modelInfo) {
        throw new Error("Invalid search type");
      }
      //query different models such as Question, Answer, User, Tag
      const queryResults = await modelInfo.model
        .find({ [modelInfo.searchField]: regexQuery })
        .limit(8);

      results = queryResults.map((result) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : result[modelInfo.searchField],
        type,
        id:
          type === "user"
            ? result.clerkId
            : type === "answer"
              ? result.question
              : result._id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log("Error in global action globalSearch function: ", error);
  }
}
