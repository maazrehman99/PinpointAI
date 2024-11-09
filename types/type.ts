export interface Task {
    id: number;
    description: string;
    assignee: string;
    deadline: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'In Progress' | 'Completed';
    tags: string[];
  }