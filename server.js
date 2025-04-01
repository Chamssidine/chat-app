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
    const { message, model, sessionId } = req.body; // Include sessionId to manage conversations
    const apiKey = getApiKey();
    console.log('message:', message);
    console.log('model:', model);

    let requestData;

    if (model === "dall-e-3") {
        urlBase = 'https://api.openai.com/v1/images/generations';

        requestData = {
            model: "dall-e-3", // Vérifiez que le modèle est bien écrit en dur
            prompt: message, 
            n: 1,
            size: "1024x1024"
        };
        
    } else {
        urlBase = 'https://api.openai.com/v1/chat/completions';

        // Initialize conversation history for this session if it doesn't exist
        if (!conversationHistory[sessionId]) {
            conversationHistory[sessionId] = [];
        }

        // Add user's message to conversation history
        conversationHistory[sessionId].push({ role: 'user', content: message });

        requestData = {
            model: model,
            messages: conversationHistory[sessionId], // Send the entire conversation history
        };
    }

    try {
        console.log("Sending request to OpenAI:", requestData);
        
        const response = await axios.post(
            urlBase,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );
    
        let botResponse;
    
        if (model === "dall-e-3") {
            console.log("DALL·E Response:", response.data);
            botResponse = response.data.data[0].url; // Vérifiez ici si data[0] existe
        } else {
            botResponse = response.data.choices[0].message.content;
            conversationHistory[sessionId].push({ role: 'assistant', content: botResponse });
        }
    
        res.json({ reply: botResponse });
    
    } catch (error) {
        console.error('❌ Erreur API OpenAI:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Échec de communication avec OpenAI.' });
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
