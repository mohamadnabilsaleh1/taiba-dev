"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { getQuestions, deleteQuestion, editQuestion } from "@/lib/actions/question.action";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

const QuestionsPage = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const result = await getQuestions({ page: 1, pageSize: 20 });
      setQuestions(result.questions);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (question: any) => {
    if (confirm(`Are you sure you want to delete "${question.title}"?`)) {
      try {
        await deleteQuestion({ questionId: question._id, path: "/dashboard/questions" });
        toast({
          title: "Success",
          description: "Question deleted successfully",
        });
        fetchQuestions();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete question",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    try {
      await editQuestion({
        questionId: editingQuestion._id,
        title: newTitle,
        content: newContent,
        path: "/dashboard/questions"
      });
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
      setEditingQuestion(null);
      fetchQuestions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (item: any) => (
        <div className="max-w-md">
          <p className="line-clamp-1 font-medium">{item.title}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {item.tags.map((tag: any) => (
              <span key={tag._id} className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    { 
      header: "Author", 
      accessor: "author",
      render: (item: any) => item.author?.name || "Unknown"
    },
    { 
      header: "Stats", 
      accessor: "views",
      render: (item: any) => (
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{item.views} views</span>
          <span>{item.upvotes.length} upvotes</span>
          <span>{item.answers.length} answers</span>
        </div>
      )
    },
    { 
      header: "Created", 
      accessor: "createdAt",
      render: (item: any) => new Date(item.createdAt).toLocaleDateString()
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Questions Management</h1>
        <p className="text-gray-400">Manage all community questions and their status.</p>
      </div>

      <AdminTable
        columns={columns}
        data={questions}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default QuestionsPage;
