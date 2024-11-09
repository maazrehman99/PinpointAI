"use client"
import React from 'react';
import { Send, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskItem } from './taskItem';
import { Task } from '@/types/type';

interface TasksCardProps {
  tasks: Task[];
  draggedTaskId: number | null;
  handleDragStart: (taskId: number) => void;
  handleDragOver: (e: React.DragEvent, taskId: number) => void;
  handleDragEnd: () => void;
  handleEditTaskClick: (task: Task) => void;
  handleDeleteTaskClick: (taskId: number) => void;
  setShowConfirmDialog: (show: boolean) => void;
}

export const TasksCard: React.FC<TasksCardProps> = ({
  tasks,
  draggedTaskId,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleEditTaskClick,
  handleDeleteTaskClick,
  setShowConfirmDialog,
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Extracted Tasks</CardTitle>
          {tasks.length > 0 && (
            <Button onClick={() => setShowConfirmDialog(true)}>
              <Send className="w-4 h-4 mr-2" />
              Export Tasks
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {tasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
              <FileText className="h-12 w-12" />
              <div className="space-y-2">
                <p className="font-medium">No tasks extracted yet</p>
                <p className="text-sm">Upload a document to get started</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  draggedTaskId={draggedTaskId}
                  handleDragStart={handleDragStart}
                  handleDragOver={handleDragOver}
                  handleDragEnd={handleDragEnd}
                  handleEditTaskClick={handleEditTaskClick}
                  handleDeleteTaskClick={handleDeleteTaskClick}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};