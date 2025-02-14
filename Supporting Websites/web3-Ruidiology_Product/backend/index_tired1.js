const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const { setEnvironmentData } = require('worker_threads');
const app = express();
const port = 3002;


app.use(express.json());
app.use(cors());

const path = "/home/junwen/a100TrainedModels/output_bloom_3b_3";

// Set up the environment variables for the Python environment
const env = {
    ...process.env,
    PATH: '/home/junwen/upt_torch_env/bin:' + process.env.PATH,
    // Add any other necessary environment variables here
};

// Create the Python process
const chatbotProcess = spawn('python', ['chatbot.py', '--path', path], {
    std: 'pipe',
    env: env
});

let output = '';

// Handle the output from the chatbot process
chatbotProcess.stdout.on('data', (data) => {
    console.log(`Chatbot output: ${data}`);
    output += data;
});

// Handle errors from the chatbot process
chatbotProcess.stderr.on('data', (data) => {
    console.error(`Chatbot error: ${data}`);
});

app.post('/run-chatbot', (req, res) => {
    const text = req.body.text; // Get the text data from the request body
    console.log('text, ', text)

    // Send the text to the Python process
    chatbotProcess.stdin.write(text + '\n');

    // Clear the output
    chatbotProcess.stdin.write('clear' + '\n');

    // Send the response back to the client
    setTimeout(() => {
        res.json({ response: output });
    }, 2000); // Delay of 2 seconds

    output = ''
});

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});