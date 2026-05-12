"use server"

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared";
import Interaction from "@/database/interaction.model";
import { revalidatePath } from "next/cache";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    // Update view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 }});

    if(userId) {
      const existingInteraction = await Interaction.findOne({ 
        user: userId,
        action: "view",
        question: questionId,
      })

      if(existingInteraction) return;

      // Create interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      })
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
}


export async function getAllInteractions(params: any) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 20 } = params;
    const skipAmount = (page - 1) * pageSize;

    const interactions = await Interaction.find({})
      .populate("user", "_id clerkId name picture")
      .populate("question", "_id title")
      .populate("answer", "_id content")
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .lean();

    const totalInteractions = await Interaction.countDocuments({});
    const isNext = totalInteractions > skipAmount + interactions.length;

    return { interactions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteInteraction(params: { interactionId: string, path: string }) {
  try {
    connectToDatabase();

    const { interactionId, path } = params;

    await Interaction.findByIdAndDelete(interactionId);

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}