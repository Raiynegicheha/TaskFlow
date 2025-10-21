"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { logout } from "@/store/slices/authSlice";
import {
  Badge,
  CheckSquare,
  FolderKanban,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

function DashboardContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  console.log("User data in Dashboard:", user);


  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  }
  const stats = [
    {
      title: "Total Projects",
      value: "0",
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Tasks",
      value: "0",
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Team Members",
      value: "1",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>

            <div className="">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="">
        {/* Welcome Section */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className={"h-20 w-20 border-4 border-white"}>
                <AvatarImage src={user?.avatar} alt="User Avatar" />
                <AvatarFallback className="text-2xl bg-white text-blue-600">
                  U
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome Back, {user?.name}
                </h1>
                <p className="text-blue-100 text-lg">{user?.email}</p>
                <Badge className="mt-2 bg-white text-blue-600 rounded-2xl">
                  {user?.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats?.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className={"pd-3"}>
                  <div className="flex items-center justify-between">
                    <CardTitle className={"text-sm font-medium text-gray-600"}>
                      {stat.title}
                    </CardTitle>
                    <div className={`${stat.bgColor} P-3 rounded-lg`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className={"border-0 shadow-lg"}>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your Latest Projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500 bg-blue-50 rounded-lg">
                <FolderKanban className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No projects yet</p>
                <p className="text-sm">
                  Create your forst project to get started
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={"border-0 shadow-lg"}>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your Recent Actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 text-center py-12 text-gray-500 rounded-lg">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No recent yet</p>
                <p className="text-sm">
                  Start working on tasks to see activity
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
