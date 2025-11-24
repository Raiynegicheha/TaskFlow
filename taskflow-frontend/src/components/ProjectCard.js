import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Calendar, Edit, Trash2, Eye} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";


// const statusColors = {
//     planning: 'bg-gray-100 text-gray-800 border-gray-300',
//     active: 'bg-blue-100 text-blue-800 border-blue-300',
//     'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-300',
//     completed: 'bg-green-100 text-green-800 border-green-300',
//     cancelled: 'bg-red-100 text-red-800 border-red-300',
// };


// const priorityColors = {
//     low: 'bg-gray-100 text-gray-700',
//     medium: 'bg-orange-100 text-blue-700',
//     high: 'bg-orange-100 text-orange-700',
//     urgent: 'bg-red-100 text-red-700',
// };


export default function ProjectCard({ project, onEdit, onDelete}){
    const router = useRouter();

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US',{
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

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
        <Card className="hover:shadow-lg transition-shadow duration-200 border-t-4" style={{ borderTopColor: project.color}}>
            
        </Card>
    )

}