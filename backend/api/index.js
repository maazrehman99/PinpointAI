// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const path = require('path');
const { WebVTTParser } = require('webvtt-parser');
const Cerebras = require('@cerebras/cerebras_cloud_sdk');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS only for your frontend origin
const corsOptions = {
    origin: [process.env.FRONTEND_ORIGIN || 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Initialize Cerebras client
const cerebras = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY
});

// Setup multer for in-memory file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Function to clean the extracted text
const cleanText = (text) => {
    return text
        .replace(/[\n\r]+/g, ' ') // Remove newline characters
        .replace(/[^\w\s,.?!]/g, '') // Remove special characters, keeping punctuation
        .trim(); // Trim leading/trailing whitespace
};

app.get('/', (req, res) => {
    res.send('Server is working');
});

// Unified API to convert .docx or .vtt to text and extract tasks
app.post('/api/convert', upload.single('file'), async (req, res) => {
    try {
        const { originalname, buffer } = req.file;
        const fileExtension = path.extname(originalname).toLowerCase();
        let text = '';

        // Process .docx file
        if (fileExtension === '.docx') {
            const { value } = await mammoth.extractRawText({ buffer });
            text = value;
        }
        // Process .vtt file
        else if (fileExtension === '.vtt') {
            const fileContent = buffer.toString('utf8');
            const parser = new WebVTTParser();
            const tree = parser.parse(fileContent, 'metadata');
            text = tree.cues.map(cue => cue.text).join(' ');
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Please upload a .docx or .vtt file.' });
        }

        // Clean the extracted text
        const cleanedText = cleanText(text);

        // Call Cerebras API to extract tasks
        const response = await cerebras.chat.completions.create({
            model: process.env.CEREBRAS_MODEL || 'llama3.1-70b',
            messages: [
                {
                    role: 'system',
                    content: `You are an AI meeting assistant specialized in extracting actionable tasks from meeting notes. For each task you identify, please ensure the following:

                    - Create a clear, actionable description.
                    - Identify the assignee if explicitly mentioned, or use "Unassigned" if no assignee is stated.
                    - Set a relevant deadline in the format (YY-MM-DD), based on the context or urgency of the task.
                    - Assess and assign a priority level (High/Medium/Low) based on the urgency and context.
                    - Set the task's initial status to "Pending".
                    - Generate relevant tags based on the task's content and context from the meeting discussion.

                    Please ensure that the output is well-structured and actionable for task management purposes.`
                },
                {
                    role: 'user',
                    content: `Analyze the following meeting notes and extract the tasks in a valid, structured JSON format. Avoid any additional text, formatting, or commentary.

                    Meeting Notes:
                    ${cleanedText}`
                }
            ],
            temperature: parseFloat(process.env.CEREBRAS_TEMPERATURE) || 0.7,
            max_completion_tokens: parseInt(process.env.CEREBRAS_MAX_TOKENS) || 2000,
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        console.log('Raw Cerebras Response:', content);

        if (!content) {
            throw new Error('No content in AI response');
        }

        // Remove any introductory text before the JSON array
        const jsonMatch = content.match(/\[.*\]/s); // Matches content between the first '[' and last ']'
        const cleanedContent = jsonMatch ? jsonMatch[0] : '';

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            console.error('Response received:', cleanedContent);
            throw new Error('Invalid JSON response from AI');
        }

        if (!Array.isArray(parsedResponse)) {
            throw new Error('Invalid response format from AI');
        }

        const tasksWithIds = parsedResponse.map((task) => ({
            id: uuidv4(),
            ...task
        }));

        res.json({ tasks: tasksWithIds });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error converting file' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
