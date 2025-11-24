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
import { getCurrentUser, logout } from "@/store/slices/authSlice";
import {
  ArrowRight,
  Badge,
  CheckSquare,
  FolderKanban,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/store/slices/projectSlice";
import Link from "next/link";

function DashboardContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  console.log("User data in Dashboard:", user);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
    dispatch(fetchProjects());
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  //Calculate stats
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalTasks = 0;
  const teamMembersCount = new Set(
    projects.flatMap((p) => p.teamMembers.map((member) => member._id) || [])
  ).size;

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

  // Recent projects
  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }
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
              <Button variant="outline" size="sm" onClick={handleLogout}>
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
                  {stat.link && (
                    <p className="text-sm text-blue-600 mt-2 flex items-center">
                      View All
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </p>
                  )}
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
              {recentProjects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FolderKanban className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No projects yet</p>
                <p className="text-sm">Create your first project to get started</p>
                <Link href="/projects">
                  <Button className="mt-4">
                    Create Project
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/projects/${project._id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-3 h-12 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <h4 className="font-semibold">{project.name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{project.status}</Badge>
                  </div>
                ))}
              </div>
            )}
              {/* <div className="text-center py-12 text-gray-500 bg-blue-50 rounded-lg">
                <FolderKanban className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No projects yet</p>
                <p className="text-sm">
                  Create your forst project to get started
                </p>
              </div> */}
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
