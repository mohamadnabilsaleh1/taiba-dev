"use client";

import React, { useEffect, useState } from "react";
import { Users, HelpCircle, MessageSquare, Tag, Activity } from "lucide-react";
import { getAdminStats } from "@/lib/actions/admin.action";
import Image from "next/image";

const IconMap: any = {
  Users,
  HelpCircle,
  MessageSquare,
  Tag,
};

const DashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getAdminStats();
        setData(statsData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-400">Real-time statistics from your platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {data?.stats.map((stat: any) => {
          const Icon = IconMap[stat.icon];
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900 p-6 shadow-sm transition-hover hover:border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white shadow-lg shadow-blue-500/20`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-white/5 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
            <Activity size={20} className="text-blue-500" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              data.recentActivity.map((activity: any) => (
                <div key={activity._id} className="flex items-center gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-800">
                    {activity.user?.picture ? (
                      <Image src={activity.user.picture} alt={activity.user.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold">
                        {activity.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium">
                      <span className="text-blue-400">{activity.user?.name || "Someone"}</span>
                      {" "}
                      <span className="text-gray-400">
                        {activity.action === "ask_question" ? "asked a question" : 
                         activity.action === "answer" ? "answered a question" : 
                         activity.action === "view" ? "viewed a question" : activity.action}
                      </span>
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {activity.question?.title || activity.answer?.content?.replace(/<[^>]*>?/gm, '') || "Activity"}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-600 whitespace-nowrap">
                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent activity found.</p>
            )}
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-2xl border border-white/5 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl font-bold">System Status</h2>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-400">Database Connection</span>
                <span className="text-green-400">Connected</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-400">Active Sessions</span>
                <span className="text-blue-400">Active</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
