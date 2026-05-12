"use client";

import React, { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { getAllUsers, deleteUser, updateUser } from "@/lib/actions/user.action";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newName, setNewName] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const result = await getAllUsers({});
      setUsers(result.users);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user: any) => {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await deleteUser({ clerkId: user.clerkId });
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        fetchUsers();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser({
        clerkId: editingUser.clerkId,
        updateData: { name: newName },
        path: "/dashboard/users"
      });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      header: "User",
      accessor: "name",
      render: (item: any) => (
        <div className="flex items-center gap-3">
          <Image
            src={item.picture}
            alt={item.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-gray-500">@{item.username}</p>
          </div>
        </div>
      ),
    },
    { header: "Email", accessor: "email" },
    { 
      header: "Reputation", 
      accessor: "reputation",
      render: (item: any) => (
        <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500">
          {item.reputation}
        </span>
      )
    },
    { 
      header: "Joined", 
      accessor: "joinedAt",
      render: (item: any) => new Date(item.joinedAt).toLocaleDateString()
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-gray-400">View and manage all registered users.</p>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={users}
        onDelete={handleDelete}
        onEdit={(user) => {
          setEditingUser(user);
          setNewName(user.name);
        }}
        isLoading={isLoading}
      />

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-gray-900 p-8 shadow-2xl ring-1 ring-white/10">
            <h2 className="text-2xl font-bold mb-6">Edit User</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg bg-gray-800 border-0 px-4 py-2 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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

export default UsersPage;
