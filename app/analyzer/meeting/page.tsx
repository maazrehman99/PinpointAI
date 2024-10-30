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
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {apiUrl }from '@/app/utils/apiConfig';

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
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setIsAnalyzing(true);
    setUploadProgress(0); // Reset progress to 0 at the start
  
    // Send the file to the API
    const formData = new FormData();
    formData.append('file', file);
  
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 90) {
          return prev + 10; // Increase by 10% every interval
        }
        return prev; // Stop at 90%
      });
    }, 500); // Adjust the interval time as needed
  
    try {
      const response = await fetch(`${apiUrl}/api/convert`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      setTasks(data.tasks);
      console.log(data.tasks)
      setUploadedFileName(file.name);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      clearInterval(interval); // Clear the interval
      setUploadProgress(100); // Ensure progress reaches 100%
      setIsAnalyzing(false);
    }
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
    const draggedIndex = updatedTasks.findIndex(task => task.id === draggedTaskId);
    const targetIndex = updatedTasks.findIndex(task => task.id === targetTaskId);

    const [draggedTask] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(targetIndex, 0, draggedTask);

    setTasks(updatedTasks);
};

const handleDragEnd = () => {
    setDraggedTaskId(null);
};





  const handleDeleteTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setShowDeleteDialog(true); // Open confirmation modal
  };

  const confirmDeleteTask = () => {
    if (selectedTaskId !== null) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== selectedTaskId));
      closeDeleteDialog(); // Close the modal after deleting
    }
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedTaskId(null); // Reset selected task
  };

  const handleEditTaskClick = (task: Task) => {
    setEditedTask({ ...task }); // Copy current task details for editing
    setShowEditDialog(true); // Open edit modal
  };

  const handleUpdateTask = () => {
    if (editedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editedTask.id ? editedTask : task))
      );
      closeEditDialog(); // Close the modal after updating
    }
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setEditedTask(null); // Reset edited task
  };

  const generatePDF = (tasks: Task[]) => {
    const doc = new jsPDF('p', 'mm', 'a4'); // Portrait, mm, A4 size
  
    // Add Header Section
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    const titleText = 'Meeting Task List';
    const dateText = `Date: ${new Date().toLocaleDateString()}`;
    
    // Calculate position for the date to align it to the right
    const pageWidth = doc.internal.pageSize.getWidth();
    const dateXPosition = pageWidth - doc.getTextWidth(dateText) - 14; // 14 is for the margin
  
    doc.text(titleText, 14, 18); // Meeting Title
    doc.text(dateText, dateXPosition, 18); // Date
  
    // Add a horizontal line under the header
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);
  
    // Define the columns and rows for the table
    const columns = ['S.No', 'Description', 'Assignee', 'Deadline', 'Priority', 'Status', 'Tags'];
    const rows = tasks.map((task, index) => [
      index + 1, // Use index + 1 for S.No
      task.description,
      task.assignee,
      task.deadline,
      task.priority,
      task.status,
      task.tags.join(', '),
    ]);
  
    // Generate the table inside the PDF
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'grid', // Change to 'grid' for a more structured look
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] }, // Blue header with white text
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray for alternate rows
      styles: {
        font: 'Helvetica',
        fontSize: 10,
        cellPadding: 4,
        minCellHeight: 10,
      },
    });
  
    // Add Footer Section with Page Numbers
    const pageCount = doc.internal.pages.length - 1; // Exclude the initial empty page
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    // Save the PDF to the user's system
    doc.save('Meeting_Tasks_Report.pdf');
  };
  

  const handleExportTasks = () => {
    generatePDF(tasks); // Call the PDF generation function
    setShowConfirmDialog(false); // Close the modal after export
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
          VTT or DOCX up to 10MB
        </span>
      </Label>
    </div>

    {/* Processing Files Section */}
    {(isAnalyzing || uploadedFileName) && (
      <div className="space-y-3">
        <p className="text-sm font-medium">Processing Files</p>
        <div className="bg-secondary rounded-lg p-3">
          <div className="flex items-center gap-3">
            {isAnalyzing ? (
              <div className="h-8 w-8 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              <FileText className="h-5 w-5 text-primary" />
            )}
            <div className="flex-1 min-w-0"> {/* Add min-w-0 to enable text truncation */}
              <p className="text-sm font-medium truncate" title={uploadedFileName || ''}>
                {uploadedFileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAnalyzing ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Analyzing document...
                  </span>
                ) : (
                  'Processed'
                )}
              </p>
            </div>
            {!isAnalyzing && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setUploadedFileName(null);
                  setTasks([]);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          {isAnalyzing && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-secondary-foreground/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
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
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExportTasks}>
              Confirm Export
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Task Modal */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Task</AlertDialogTitle>
            <AlertDialogDescription>
              Update the task details below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col space-y-4">
            {editedTask && (
              <>
                <input
                  type="text"
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  placeholder="Task Description"
                  className="p-2 border rounded"
                />
                <input
                  type="text"
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                  placeholder="Assignee"
                  className="p-2 border rounded"
                />
                <input
                  type="date"
                  value={editedTask.deadline}
                  onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                  className="p-2 border rounded"
                />
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as Task['priority'] })}
                  className="p-2 border rounded"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select
                  value={editedTask.status}
                  onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as Task['status'] })}
                  className="p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <input
                  type="text"
                  value={editedTask.tags.join(', ')} // Assuming tags are strings
                  onChange={(e) => setEditedTask({ ...editedTask, tags: e.target.value.split(', ').map(tag => tag.trim()) })}
                  placeholder="Tags (comma separated)"
                  className="p-2 border rounded"
                />
              </>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeEditDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateTask}>Update Task</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    
  );
};

export default MeetingTaskAnalyzer;