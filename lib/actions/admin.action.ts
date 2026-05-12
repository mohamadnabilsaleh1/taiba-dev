"use server";

import User from "@/database/user.model";
import Question from "@/database/question.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import Interaction from "@/database/interaction.model";
import { connectToDatabase } from "../mongoose";

export async function getAdminStats() {
  try {
    await connectToDatabase();

    const [userCount, questionCount, answerCount, tagCount] = await Promise.all([
      User.countDocuments({}),
      Question.countDocuments({}),
      Answer.countDocuments({}),
      Tag.countDocuments({}),
    ]);

    const recentActivity = await Interaction.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name picture")
      .populate("question", "title")
      .populate("answer", "content")
      .lean();

    return {
      stats: [
        { label: "Total Users", value: userCount.toString(), icon: "Users", color: "bg-blue-500" },
        { label: "Questions", value: questionCount.toString(), icon: "HelpCircle", color: "bg-purple-500" },
        { label: "Answers", value: answerCount.toString(), icon: "MessageSquare", color: "bg-green-500" },
        { label: "Tags", value: tagCount.toString(), icon: "Tag", color: "bg-orange-500" },
      ],
      recentActivity,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}
