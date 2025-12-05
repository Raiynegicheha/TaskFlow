"use client";

import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ProjectFormDialog from "@/components/ProjectFormDialog";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  deleteProject,
  fetchProject,
  updateProject,
} from "@/store/slices/projectSlice";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  AlertCircle,
  ArrowLeft,
  Badge,
  CheckCircle2,
  Clock,
  Edit,
  Loader2,
  MoreVertical,
  Trash2,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dropdown } from "react-day-picker";
import { useDispatch, useSelector } from "react-redux";

const statusColors = {
  planning: "bg-gray-100 text-gray-800 border-gray-300",
  active: "bg-blue-100 text-blue-800 border-blue-300",
  "on-hold": "bg-yellow-100 text-yellow-800 border-yellow-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

function ProjectDetailsContent({ projectId }) {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentProject, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  console.log("Current Project:", currentProject);
  console.log({ user, params });

  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProject(params.id));
    }
    // Fetch project details when component mounts
  }, [dispatch, params.id]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleUpdateProject = async (projectData) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        updateProject({
          id: currentProject.id,
          updates: projectData,
        })
      ).unwrap();
      // setIsSubmitting(false);
      setEditDialog(false);
    } catch (error) {
      console.error("Failed to update project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(deleteProject(currentProject.id)).unwrap();
      router.push("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(currentProject.dueDate);
  const isOverdue = daysRemaining < 0;
  const isDueSoon = daysRemaining >= 0 && daysRemaining <= 7;
  const isOwner = currentProject.owner._id === user?.id;

  //Mock task statistics (We'll replace with real data once task are implemented)
  const taskStats = {
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max--w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant={"ghost"} onClick={() => router.push("/projects")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditDialog(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>

      <div className="max-e-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Details and other content goes here */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-2 h-20 rounded-full flex-shrink-0"
              style={{ backgroundColor: currentProject.color }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900">
                  {currentProject.name}
                </h1>
                <Badge
                  className={statusColors[currentProject.status]}
                  variant="outline"
                >
                  {currentProject.status}
                </Badge>
                <Badge className={priorityColors[currentProject.priority]}>
                  {currentProject.priority}
                </Badge>
              </div>
              <p className="text-lg text-gray-600">
                {currentProject.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          {currentProject.tags && currentProject.tags.length > 0 && (
            <div className="lex gap-2 flex-wrap">
              {currentProject.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Progress Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className={"pb-3"}>
              <CardTitle
                className={
                  "text-sm font-medium text-gray-600 flex items-center"
                }
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {currentProject.progress}%
              </div>
              <Progress value={currentProject.progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Task Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className={"pb-3"}>
              <CardTitle className={"text-sm font-medium text-gray-600"}>
                Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {taskStats.completed} / {taskStats.total}
              </div>
              <p className="text-sm text-gray-500">
                {taskStats.inProgress} in progress
              </p>
            </CardContent>
          </Card>

          {/* Due Date Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className={"pb-3"}>
              <CardTitle className={"text-sm font-medium text-gray-600"}>
                Due Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-lg font-bold mb-1 ${
                  isOverdue
                    ? "text-red-600"
                    : isDueSoon
                    ? "text-orange-600"
                    : ""
                }`}
              >
                {formatDate(currentProject.dueDate)}
              </div>
              <p
                className={`text-sm ${
                  isOverdue
                    ? "text-red-600"
                    : isDueSoon
                    ? "text-orange-600"
                    : "text-gray-500"
                }`}
              >
                {isOverdue ? (
                  <span className="flex items-center">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    {Math.abs(daysRemaining)} days overdue
                  </span>
                ) : isDueSoon ? (
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {daysRemaining} days remaining
                  </span>
                ) : (
                  <span>{daysRemaining} days remaining</span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Team Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className={"pb-3"}>
              <CardTitle
                className={"text-sm font-medium text-gray-600 items-center"}
              >
                <Users className="mr-2 h-4 w-4" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {currentProject.teamMembers.length || 0}
              </div>
              <div className="">
                {currentProject.teamMembers
                  ?.slice(0, 5)
                  .map((member, index) => (
                    <Avatar
                      key={index}
                      className={"h-8 w-8 border-2 border-white"}
                    >
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className={"text-xs"}>
                        {member.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                {currentProject.teamMembers?.length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                    +{currentProject.teamMembers.length - 5}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Info */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">
                  Owner
                </h4>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={currentProject.owner.avatar}
                      alt={currentProject.owner.name}
                    />
                    <AvatarFallback>
                      {currentProject.owner.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentProject.owner.name}</p>
                    <p className="text-sm text-gray-500">
                      {currentProject.owner.email}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">
                  Created
                </h4>
                <p>{formatDate(currentProject.createdAt)}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-600 mb-1">
                  Last Updated
                </h4>
                <p>{formatDate(currentProject.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentProject.teamMembers?.map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                    {member._id === currentProject.owner._id && (
                      <Badge variant="secondary" className="text-xs">
                        Owner
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section Placeholder */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button>Add Task</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-2">
                Task board coming soon!
              </p>
              <p className="text-sm">
                `We'll add the Kanban board here in the next step`
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <ProjectFormDialog
        open={editDialog}
        onOpenChange={setEditDialog}
        onSubmit={handleUpdateProject}
        project={currentProject}
        isLoading={isSubmitting}
      />

      <DeleteConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={handleDeleteProject}
        title="Delete Project?"
        description={`Are you sure you want to delete "${currentProject.name}"? This action cannot be undone and will delete all associated tasks.`}
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default function ProjectDetailPage() {
  return (
    <ProtectedRoute>
      <ProjectDetailsContent />
    </ProtectedRoute>
  );
}
