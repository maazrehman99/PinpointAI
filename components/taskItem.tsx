"use client"
import React from 'react';
import { User, Calendar, GripVertical, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from '@/types/type';

interface TaskItemProps {
  task: Task;
  draggedTaskId: number | null;
  handleDragStart: (taskId: number) => void;
  handleDragOver: (e: React.DragEvent, taskId: number) => void;
  handleDragEnd: () => void;
  handleEditTaskClick: (task: Task) => void;
  handleDeleteTaskClick: (taskId: number) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  draggedTaskId,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleEditTaskClick,
  handleDeleteTaskClick,
}) => {
  const getBadgeVariant = (priority: Task['priority']): string => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      draggable
      onDragStart={() => handleDragStart(task.id)}
      onDragOver={(e) => handleDragOver(e, task.id)}
      onDragEnd={handleDragEnd}
      className={`group relative p-4 border rounded-lg bg-card hover:shadow-md transition-all ${
        draggedTaskId === task.id ? 'opacity-50' : ''
      }`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start gap-4">
        <div className="cursor-move">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <p className="font-medium">{task.description}</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditTaskClick(task)}>Edit Task</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTaskClick(task.id)}>
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <User className="w-4 h-4 mr-1" />
              {task.assignee}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-1" />
              {task.deadline}
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeVariant(task.priority)}`}>
              {task.priority}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {task.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};