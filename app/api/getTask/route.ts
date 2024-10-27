// app/api/process-notes/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define types to match frontend expectations
interface Task {
  id: number;
  description: string;
  assignee: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  tags: string[];
}

interface ProcessedTasks {
  tasks: Task[];
}

export async function POST(req: Request) {
  try {
    const { meetingNotes } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specialized in analyzing meeting notes and extracting actionable tasks. 
          For each task you identify:
          - Create a clear, actionable description
          - Identify the assignee if mentioned (use "Unassigned" if not specified)
          - Set an appropriate deadline based on context or urgency
          - Determine priority (High/Medium/Low) based on context and urgency
          - Set initial status as "Pending"
          - Extract or generate relevant tags based on the task context
          
          Format requirements:
          - Each task must have all required fields
          - Deadlines should be in YYYY-MM-DD format
          - Generate realistic but future dates
          - Priority must be exactly "High", "Medium", or "Low"
          - Status must be "Pending", "In Progress", or "Completed"
          - Tags should be relevant business categories
          
          Important:
          - Focus on concrete, actionable items
          - Exclude vague discussions or ideas
          - Each task should be clearly defined and achievable
          - If dates are mentioned, use them for deadlines
          - Infer priority from urgency words and context`
        },
        {
          role: "user",
          content: `Please analyze these meeting notes and extract tasks in the following JSON format:
          {
            "tasks": [
              {
                "id": number,
                "description": string,
                "assignee": string,
                "deadline": "YYYY-MM-DD",
                "priority": "High" | "Medium" | "Low",
                "status": "Pending" | "In Progress" | "Completed",
                "tags": string[]
              }
            ]
          }
          
          Meeting notes:
          ${meetingNotes}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    // Check if response content exists
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the response
    const parsedResponse = JSON.parse(content) as ProcessedTasks;

    // Validate the response format
    if (!parsedResponse.tasks || !Array.isArray(parsedResponse.tasks)) {
      throw new Error("Invalid response format from AI");
    }

    // Ensure all tasks have required fields and assign IDs if missing
    const validatedTasks = parsedResponse.tasks.map((task, index) => {
      if (!task.description || !task.deadline || !task.priority || !task.status || !task.tags) {
        throw new Error("Missing required task fields");
      }

      // Ensure task has an ID, if not assign one
      return {
        ...task,
        id: task.id || index + 1,
        status: task.status || 'Pending',
        assignee: task.assignee || 'Unassigned'
      };
    });

    return NextResponse.json({ tasks: validatedTasks });

  } catch (error) {
    console.error('Error processing meeting notes:', error);
    return NextResponse.json(
      { error: 'Failed to process meeting notes' },
      { status: 500 }
    );
  }
}