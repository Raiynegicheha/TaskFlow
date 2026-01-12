import { card, cardContent } from "@components/ui/card";
import { badge } from "@components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Calendar, MoreVertical, Edit, Trash2, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const priorityColors = {
  low: "bg-gray-100 text-gray-700 border-gray-300",
  medium: "bg-blue-100 text-blue-700 border-blue-300",
  high: "bg-orange-100 text-orange-700 border-orange-300",
  urgent: "bg-red-100 text-red-700 border-red-300",
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "completed";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <CardContent className="p-4" {...attributes} {...listeners}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm line-clamp-2 flex-1 pr-2">
            {task.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="p-h-6 w-6 p-0"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge className={priorityColors[task.priority]} variant="outline">
            {task.priority}
          </Badge>
          {task.tags?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          {task.dueDate && (
            <div
              className={`flex items-center ${
                isOverdue ? "text-red-600 font-medium" : ""
              }`}
            >
              <Calendar className="mr-1 h-3 w-3" />
              {formatDate(task.dueDate)}
            </div>
          )}

          {task.assignedTo ? (
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={task.assignedTo.avatar}
                alt={task.assignedTo.name}
              />
              <AvatarFallback className="text-xs">
                {task.assignedTo.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center text-gray-400">
              <User className="h-3 w-3 mr-1" />
              <span className="text-xs">Unassigned</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
