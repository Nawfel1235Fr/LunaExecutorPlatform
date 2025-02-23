import { Navbar } from "@/components/layout/navbar";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { AdminPanel } from "@/components/admin/admin-panel";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { UserStat } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats } = useQuery<UserStat[]>({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  const statsData = [
    {
      title: "Total Executions",
      value: user?.taskCount ?? 0,
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M2 12h20" />
        </svg>
      ),
    },
    {
      title: "Success Rate",
      value: `${user?.successRate ?? 0}%`,
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      title: "Days Active",
      value: stats?.length ?? 0,
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  const chartData = stats?.map((stat) => ({
    name: new Date(stat.date).toLocaleDateString(),
    success: stat.successCount,
    failure: stat.failureCount,
  })) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <stat.icon className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="success"
                    name="Succès"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="failure"
                    name="Échecs"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {user?.isAdmin && <AdminPanel />}
        </motion.div>
      </main>

      <ChatWidget />
    </div>
  );
}