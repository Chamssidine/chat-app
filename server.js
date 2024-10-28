import express from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { url } from 'inspector';

// Set up __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
var urlBase = 'https://api.openai.com/v1/chat/completions';

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

// Read API key from apiKey.txt
function getApiKey() {
    const apiKeyPath = path.join(__dirname, 'apiKey.txt');
    return fs.readFileSync(apiKeyPath, 'utf8').trim();
}

// Store conversation history
const conversationHistory = {};

app.post('/api/chat', async (req, res) => {
    const { message, model, sessionId } = req.body; // Include a sessionId to manage conversations
   
    const apiKey = getApiKey();
    console.log('message:', message);
    console.log('model:', model);
    if(model == "dall-e-3")
        urlBase = 'https://api.openai.com/v1/images/generations';
    else
        urlBase = 'https://api.openai.com/v1/chat/completions'

    console.log('urlbase:',urlBase);
    // Initialize the conversation history for this session if it doesn't exist
    if (!conversationHistory[sessionId]) {
        conversationHistory[sessionId] = [];
    }

    // Add the user's message to the conversation history
    conversationHistory[sessionId].push({ role: 'user', content: message });

    try {
        const response = await axios.post(
            urlBase
           ,
            {
                model: model,
                messages: conversationHistory[sessionId], // Send the entire conversation history
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        const botResponse = response.data.choices[0].message.content;

        // Add the bot's response to the conversation history
        conversationHistory[sessionId].push({ role: 'assistant', content: botResponse });

        res.json({ reply: botResponse });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        res.status(500).json({ error: 'Failed to get a response from OpenAI.' });
    }
});

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
