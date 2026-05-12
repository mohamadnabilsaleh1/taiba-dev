"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { getAllInteractions, deleteInteraction } from "@/lib/actions/interaction.action";
import { toast } from "@/components/ui/use-toast";

const InteractionsPage = () => {
  const [interactions, setInteractions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInteractions = async () => {
    try {
      setIsLoading(true);
      const result = await getAllInteractions({ page: 1, pageSize: 50 });
      setInteractions(result.interactions);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch interactions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  const handleDelete = async (interaction: any) => {
    if (confirm(`Are you sure you want to delete this interaction?`)) {
      try {
        await deleteInteraction({ interactionId: interaction._id, path: "/dashboard/interactions" });
        toast({
          title: "Success",
          description: "Interaction deleted successfully",
        });
        fetchInteractions();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete interaction",
          variant: "destructive",
        });
      }
    }
  };

  const columns = [
    {
      header: "Action",
      accessor: "action",
      render: (item: any) => (
        <span className="capitalize font-semibold text-blue-400">
          {item.action.replace("_", " ")}
        </span>
      ),
    },
    { 
      header: "User", 
      accessor: "user",
      render: (item: any) => item.user?.name || "Unknown"
    },
    { 
      header: "Related Content", 
      accessor: "question",
      render: (item: any) => (
        <div className="max-w-xs">
          {item.question && <p className="line-clamp-1 text-xs">Q: {item.question.title}</p>}
          {item.answer && <p className="line-clamp-1 text-xs text-gray-500">A: {item.answer.content.replace(/<[^>]*>?/gm, '')}</p>}
        </div>
      )
    },
    { 
      header: "Date", 
      accessor: "createdAt",
      render: (item: any) => new Date(item.createdAt).toLocaleString()
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interactions Log</h1>
        <p className="text-gray-400">View and audit all user interactions across the platform.</p>
      </div>

      <AdminTable
        columns={columns}
        data={interactions}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default InteractionsPage;
