"use client"

import React, { useState } from 'react';
import { Upload, FileText, Send, Download, Loader2, Clock, User, Calendar, GripVertical, Edit, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: number;
  description: string;
  assignee: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  tags: string[];
}

const MeetingTaskAnalyzer: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const simulateFileAnalysis = (): void => {
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      setTasks([
        {
          id: 1,
          description: "Review Q4 marketing strategy and prepare presentation for stakeholders",
          assignee: "John Doe",
          deadline: "2024-11-15",
          priority: "High",
          status: "Pending" ,

          tags: ["Marketing", "Q4", "Strategy"]
        },
        {
          id: 2,
          description: "Update website content and implement new SEO recommendations",
          assignee: "Jane Smith",
          deadline: "2024-11-20",
          priority: "Medium",
          status: "In Progress",
          tags: ["Website", "SEO"]
        },
        {
          id: 3,
          description: "Set up analytics dashboard for new campaign",
          assignee: "Mike Johnson",
          deadline: "2024-11-25",
          priority: "Low",
          status: "Pending",
          tags: ["Analytics", "Campaign"]
        }
      ]);
      setIsAnalyzing(false);
      setUploadProgress(0);
    }, 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    simulateFileAnalysis();
  };

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

  const handleDragStart = (taskId: number) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, targetTaskId: number) => {
    e.preventDefault();
    if (draggedTaskId === null || draggedTaskId === targetTaskId) return;

    const updatedTasks = [...tasks];
    const draggedIndex = tasks.findIndex(task => task.id === draggedTaskId);
    const targetIndex = tasks.findIndex(task => task.id === targetTaskId);

    const [draggedTask] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(targetIndex, 0, draggedTask);

    setTasks(updatedTasks);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Meeting Task Analyzer</h1>
        <p className="text-muted-foreground">
          Upload your meeting documents and let AI extract and organize tasks automatically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Upload Document</CardTitle>
            <CardDescription>Support for PDF and DOCX files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
              <Input
                id="file"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Label 
                htmlFor="file" 
                className="cursor-pointer space-y-2 flex flex-col items-center"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="font-medium">Drop files or click to upload</span>
                <span className="text-sm text-muted-foreground">
                  PDF or DOCX up to 10MB
                </span>
              </Label>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Analyzing document...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Section */}
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
                    <div
                      key={task.id}
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
                                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
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
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Export Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export Tasks</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a PDF summary and send it to all meeting attendees. 
              The summary will include task descriptions, assignees, deadlines, and priorities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              Confirm Export
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    
  );
};

export default MeetingTaskAnalyzer;