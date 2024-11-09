"use client"
import React from 'react';
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
import { Task } from '@/types/type';

interface DialogsProps {
  showConfirmDialog: boolean;
  showDeleteDialog: boolean;
  showEditDialog: boolean;
  showErrorDialog: boolean;
  errorMessage: string;
  editedTask: Task | null;
  setShowConfirmDialog: (show: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;
  setShowErrorDialog: (show: boolean) => void;
  setEditedTask: (task: Task | null) => void;
  handleExportTasks: () => void;
  confirmDeleteTask: () => void;
  handleUpdateTask: () => void;
  closeDeleteDialog: () => void;
  closeEditDialog: () => void;
}

export const Dialogs: React.FC<DialogsProps> = ({
  showConfirmDialog,
  showDeleteDialog,
  showEditDialog,
  showErrorDialog,
  errorMessage,
  editedTask,
  setShowConfirmDialog,
  setShowDeleteDialog,
  setShowEditDialog,
  setShowErrorDialog,
  setEditedTask,
  handleExportTasks,
  confirmDeleteTask,
  handleUpdateTask,
  closeDeleteDialog,
  closeEditDialog,
}) => {
  return (
    <>
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

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Oops! Something Went Wrong</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                  value={editedTask.tags.join(', ')}
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
    </>
  );
};
