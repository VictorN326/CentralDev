"use server";

import User from "@/database/User.model";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/Tag.model";
import Question from "@/database/question.model";

export async function getTopTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId, limit = 3 } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // find interaction for the user and groups by tags

    const interactions = await Question.aggregate([
      { $match: { author: userId } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    // find the tags from the interactions
    const tags = await Tag.find({
      _id: { $in: interactions.map((i) => i._id) },
    });

    return tags;
  } catch (error) {
    console.log("DEBUG: getTopTags error: ", error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    let sortOptions = {};
    switch (filter) {
      case "popular":
        sortOptions = { questionCount: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }
    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }
    const totalTags = await Tag.countDocuments(query);
    const tags = await Tag.find(query)
      //added collation as extra to sort by case insensitive for the tag names
      .collation({ locale: "en", strength: 2 })
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const isNext = totalTags > skipAmount + pageSize;
    return { tags, isNext };
  } catch (error) {
    console.log("DEBUG: getAllTags error: ", error);
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 5, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1, //+1 is because we need to check if there is next page
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;
    const isNext = questions.length > pageSize;
    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log("DEBUG: getQuestionsByTagId error: ", error);
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, questionCount: { $size: "$questions" } } },
      { $sort: { questionCount: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log("DEBUG: getPopularTags error: ", error);
  }
}
