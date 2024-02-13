import express from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv'; 
import cors from 'cors';


dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/get-advice', async (req, res) => {
    try {
        const userGoal = req.body.goal;

        const advice = await openai.chat.completions.create({
            messages: [
                {
                    "role": "user", 
                    "content": `Give me a short tip of less than 50 words to complete this ${userGoal}`
                }
            ],
            model: "gpt-3.5-turbo",
        });
    
        res.json({ advice: advice.choices[0].message });
    }
    catch (error){
        console.error('Error calling the API from OpenAI:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


app.listen(port, () => {
    console.log(`Running server`)
})