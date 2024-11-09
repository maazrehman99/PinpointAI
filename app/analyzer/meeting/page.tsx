"use client"
import React, { useState } from 'react';
import { UploadCard } from '@/components/uploadCard';
import { TasksCard } from '@/components/taskCard';
import { Dialogs } from '@/components/dialog';
import { Task } from '@/types/type';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { apiUrl } from '@/app/utils/apiConfig';

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
  const [currentDocumentName, setCurrentDocumentName] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'vtt' && fileExtension !== 'docx') {
      setErrorMessage('This file format is currently not supported. Please upload a VTT or DOCX file.');
      setShowErrorDialog(true);
      e.target.value = '';
      return;
    }
    setIsAnalyzing(true);
    setUploadProgress(0);
    setCurrentDocumentName(file.name);

    const interval = setInterval(() => {
      setUploadProgress((prev) => prev < 90 ? prev + 10 : prev);
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${apiUrl}/api/convert`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
        setUploadedFileName(file.name);
      } else {
        setErrorMessage("We are facing high usage now. Please try again later. Sorry for the inconvenience faced.");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage("We are facing high usage now. Please try again later. Sorry for the inconvenience faced.");
      setShowErrorDialog(true);
    } finally {
      clearInterval(interval);
      setUploadProgress(100);
      setIsAnalyzing(false);
    }
  };

  const cancelUpload = () => {
    setUploadedFileName(null);
    setCurrentDocumentName(null);
    setTasks([]);
    setIsAnalyzing(false);
    setUploadProgress(0);
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
    setShowDeleteDialog(true);
  };

  const confirmDeleteTask = () => {
    if (selectedTaskId !== null) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== selectedTaskId));
      closeDeleteDialog();
    }
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedTaskId(null);
  };

  const handleEditTaskClick = (task: Task) => {
    setEditedTask({ ...task });
    setShowEditDialog(true);
  };

  const handleUpdateTask = () => {
    if (editedTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editedTask.id ? editedTask : task))
      );
      closeEditDialog();
    }
  };

  const closeEditDialog = () => {
    setShowEditDialog(false);
    setEditedTask(null);
  };

  const generatePDF = (tasks: Task[]) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    const titleText = 'Meeting Task List';
    const dateText = `Date: ${new Date().toLocaleDateString()}`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const dateXPosition = pageWidth - doc.getTextWidth(dateText) - 14;

    doc.text(titleText, 14, 18);
    doc.text(dateText, dateXPosition, 18);
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    const columns = ['S.No', 'Description', 'Assignee', 'Deadline', 'Priority', 'Status', 'Tags'];
    const rows = tasks.map((task, index) => [
      index + 1,
      task.description,
      task.assignee,
      task.deadline,
      task.priority,
      task.status,
      task.tags.join(', '),
    ]);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: {
        font: 'Helvetica',
        fontSize: 10,
        cellPadding: 4,
        minCellHeight: 10,
      },
    });

    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }

    doc.save('Meeting_Tasks_Report.pdf');
  };

  const handleExportTasks = () => {
    generatePDF(tasks);
    setShowConfirmDialog(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Meeting Task Analyzer</h1>
        <p className="text-muted-foreground">
          Upload your meeting documents and let AI extract and organize tasks automatically
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UploadCard
          handleFileUpload={handleFileUpload}
          isAnalyzing={isAnalyzing}
          uploadedFileName={uploadedFileName}
          currentDocumentName={currentDocumentName}
          uploadProgress={uploadProgress}
          cancelUpload={cancelUpload}
        />

        <TasksCard
          tasks={tasks}
          draggedTaskId={draggedTaskId}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDragEnd={handleDragEnd}
          handleEditTaskClick={handleEditTaskClick}
          handleDeleteTaskClick={handleDeleteTaskClick}
          setShowConfirmDialog={setShowConfirmDialog}
        />
      </div>

      <Dialogs
        showConfirmDialog={showConfirmDialog}
        showDeleteDialog={showDeleteDialog}
        showEditDialog={showEditDialog}
        showErrorDialog={showErrorDialog}
        errorMessage={errorMessage}
        editedTask={editedTask}
        setShowConfirmDialog={setShowConfirmDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        setShowEditDialog={setShowEditDialog}
        setShowErrorDialog={setShowErrorDialog}
        setEditedTask={setEditedTask}
        handleExportTasks={handleExportTasks}
        confirmDeleteTask={confirmDeleteTask}
        handleUpdateTask={handleUpdateTask}
        closeDeleteDialog={closeDeleteDialog}
        closeEditDialog={closeEditDialog}
      />
    </div>
  );
};

export default MeetingTaskAnalyzer;