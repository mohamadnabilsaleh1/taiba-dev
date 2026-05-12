"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { getAllTags, deleteTag, updateTag } from "@/lib/actions/tag.action";
import { toast } from "@/components/ui/use-toast";

const TagsPage = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const result = await getAllTags({ page: 1, pageSize: 50 });
      setTags(result.tags);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch tags",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async (tag: any) => {
    if (confirm(`Are you sure you want to delete tag "${tag.name}"?`)) {
      try {
        await deleteTag({ tagId: tag._id, path: "/dashboard/tags" });
        toast({
          title: "Success",
          description: "Tag deleted successfully",
        });
        fetchTags();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete tag",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag) return;

    try {
      await updateTag({
        tagId: editingTag._id,
        name: newName,
        description: newDescription,
        path: "/dashboard/tags"
      });
      toast({
        title: "Success",
        description: "Tag updated successfully",
      });
      setEditingTag(null);
      fetchTags();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      header: "Tag Name",
      accessor: "name",
      render: (item: any) => (
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500">
          {item.name}
        </span>
      ),
    },
    { 
      header: "Questions Count", 
      accessor: "questions",
      render: (item: any) => item.questions.length
    },
    { 
      header: "Description", 
      accessor: "description",
      render: (item: any) => (
        <p className="max-w-xs line-clamp-1 text-gray-500">
          {item.description || "No description provided"}
        </p>
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
        <h1 className="text-3xl font-bold tracking-tight">Tags Management</h1>
        <p className="text-gray-400">Organize and manage system tags.</p>
      </div>

      <AdminTable
        columns={columns}
        data={tags}
        onDelete={handleDelete}
        onEdit={(tag) => {
          setEditingTag(tag);
          setNewName(tag.name);
          setNewDescription(tag.description || "");
        }}
        isLoading={isLoading}
      />

      {editingTag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-2xl ring-1 ring-white/10">
            <h2 className="text-2xl font-bold mb-6">Edit Tag</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tag Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border-0 px-4 py-2 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-gray-800 border-0 px-4 py-2 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setEditingTag(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsPage;
