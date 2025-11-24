"use client";

import { Edit, Eye, MoreVertical, Trash, Trash2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

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

export default function ProjectCard({ project, onEdit, onDelete }) {
  const router = useRouter();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
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

  const daysRemaining = getDaysRemaining(project.dueDate);
  const isOverdue = daysRemaining < 0;
  const isDueSoon = daysRemaining >= 0 && daysRemaining <= 7;
  return (
    <Card
      className="hover:shadow-lg transition-shadow duration-200 border-t-4"
      style={{ borderTopColor: project.color || "#000" }}
    >
      <CardHeader className={"pb-3"}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            {/* DropdownMenuContent and items would go here */}
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(project)}
                className={"text-red-600"}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className={"pb-3"}>
        <div className="flex gap-2 mb-3 flex-wrap">
          <Badge className={statusColors[project.status]} variant="outline">
            {project.status}
          </Badge>
          <Badge className={priorityColors[project.priority]} variant="outline">
            {project.priority}
          </Badge>
          {project.tags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className={"text-xs"}>
              {tag}
            </Badge>
          ))}
          {project.tags?.length > 2 && (
            <Badge variant="secondary" className={"text-xs"}>
              +{project.tags.length - 2} more
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            {/* <Calendar className="mr-2 h-4 w-4" /> */}
            <span>
              Due {formatDate(project.dueDate)}
              {isOverdue && "(Overdue)"}
              {isDueSoon && !isOverdue && `(${daysRemaining}d left)`}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <Users className="mr-2 h-4 w-4 inline" />
            <div className="flex -space-x-2">
              {project.teamMembers?.slice(0, 3).map((member, index) => (
                <Avatar key={index} className={"h-6 w-6 border-2 border-white"}>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="text-xs">
                    {member.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.teamMembers?.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                  +{project.teamMembers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="w-full">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
