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
            <h4 className="font-semibold text-sm line-clamp-2 flex-1 pr-2">{task.title}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
