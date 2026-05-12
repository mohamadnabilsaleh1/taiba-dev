"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { getAllAnswers, deleteAnswer, updateAnswer } from "@/lib/actions/answer.action";
import { toast } from "@/components/ui/use-toast";

const AnswersPage = () => {
  const [answers, setAnswers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAnswer, setEditingAnswer] = useState<any>(null);
  const [newContent, setNewContent] = useState("");

  const fetchAnswers = async () => {
    try {
      setIsLoading(true);
      const result = await getAllAnswers({ page: 1, pageSize: 20 });
      setAnswers(result.answers);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch answers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  const handleDelete = async (answer: any) => {
    if (confirm(`Are you sure you want to delete this answer?`)) {
      try {
        await deleteAnswer({ answerId: answer._id, path: "/dashboard/answers" });
        toast({
          title: "Success",
          description: "Answer deleted successfully",
        });
        fetchAnswers();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete answer",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnswer) return;

    try {
      await updateAnswer({
        answerId: editingAnswer._id,
        content: newContent,
        path: "/dashboard/answers"
      });
      toast({
        title: "Success",
        description: "Answer updated successfully",
      });
      setEditingAnswer(null);
      fetchAnswers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update answer",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      header: "Content",
      accessor: "content",
      render: (item: any) => (
        <div className="max-w-md">
          <p className="line-clamp-2">{item.content.replace(/<[^>]*>?/gm, '')}</p>
        </div>
      ),
    },
    { 
      header: "Question", 
      accessor: "question",
      render: (item: any) => (
        <p className="max-w-xs line-clamp-1 text-xs text-blue-400">
          {item.question?.title || "Deleted Question"}
        </p>
      )
    },
    { 
      header: "Author", 
      accessor: "author",
      render: (item: any) => item.author?.name || "Unknown"
    },
    { 
      header: "Votes", 
      accessor: "upvotes",
      render: (item: any) => (
        <span className="text-xs font-medium">
          {item.upvotes.length - item.downvotes.length}
        </span>
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
        <h1 className="text-3xl font-bold tracking-tight">Answers Management</h1>
        <p className="text-gray-400">Moderate and manage all community answers.</p>
      </div>

      <AdminTable
        columns={columns}
        data={answers}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AnswersPage;
