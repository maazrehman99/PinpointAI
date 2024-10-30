// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');
const { WebVTTParser } = require('webvtt-parser');
const OpenAI = require('openai');
const cors = require('cors'); // Import cors package

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors()); // Use CORS middleware

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Use the API key from the environment variable
});

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Function to clean the extracted text
const cleanText = (text) => {
    return text
        .replace(/[\n\r]+/g, ' ') // Remove newline characters
        .replace(/[^\w\s,.?!]/g, '') // Remove special characters, keeping punctuation
        .trim(); // Trim leading/trailing whitespace
};
app.get('/', (req, res) => {
    res.send('server is working');
});
// Unified API to convert .docx or .vtt to text and extract tasks
app.post('/api/convert', upload.single('file'), async (req, res) => {
    try {
        const { path: filePath, originalname } = req.file;
        const fileExtension = path.extname(originalname).toLowerCase();
        let text = '';

        // Process .docx file
        if (fileExtension === '.docx') {
            const { value } = await mammoth.extractRawText({ path: filePath });
            text = value;
        }
        // Process .vtt file
        else if (fileExtension === '.vtt') {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const parser = new WebVTTParser();
            const tree = parser.parse(fileContent, 'metadata');
            text = tree.cues.map(cue => cue.text).join(' ');
        } else {
            return res.status(400).json({ error: 'Unsupported file type. Please upload a .docx or .vtt file.' });
        }

        // Clean the extracted text
        const cleanedText = cleanText(text);
        
        // Call OpenAI API to extract tasks
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
                    - Extract or generate relevant tags based on the task context`
                },
                {
                    role: "user",
                    content: `Analyze these meeting notes and extract tasks in valid JSON format without any additional text or formatting.\n\nMeeting notes:\n${cleanedText}`
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        // Check if response content exists
        const content = response.choices[0]?.message?.content;
        console.log("Raw OpenAI Response:", content); // Log the raw response content

        if (!content) {
            throw new Error("No content in AI response");
        }

        // Clean the response to remove backticks and any Markdown formatting
        const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();

        // Parse the cleaned response
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            console.error('Response received:', cleanedContent); // Log the raw cleaned response if parsing fails
            throw new Error("Invalid JSON response from AI");
        }

        // Validate and format tasks
        if (!Array.isArray(parsedResponse)) {
            throw new Error("Invalid response format from AI");
        }

        // Send tasks back to the client
        res.json({ tasks: parsedResponse });

        fs.unlinkSync(filePath); // Delete the file after processing
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Error converting file' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports=app;
