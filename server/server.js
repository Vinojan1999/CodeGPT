import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());        // Allows cross origin request and allow server to be called from the fontend
app.use(express.json());      // Allows to pass JSON from the frontend to the backend

// Dummy root route
app.get('/', async (req, res) => {
    res.status(200).send({
        message: "Hello from CodeGPT",
    })
}); 

app.post('/',  async (req, res) => {
    try {
        // from the frontend (textarea)
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,     // higher temp value means, model will take more risks
            max_tokens: 3000,   // to long responses
            top_p: 1,           
            frequency_penalty: 0.5,    // It's not going to repeat similar sentences often
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error });
    }
})

app.listen(5000, () => console.log("Server is running on https://codegpt-zl3k.onrender.com"));
