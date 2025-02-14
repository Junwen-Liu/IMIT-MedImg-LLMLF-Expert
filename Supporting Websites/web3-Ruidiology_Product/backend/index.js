const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const Queue = require('better-queue');
const app = express();
const port = 3002;

app.use(express.json());
app.use(cors());

let queue = new Queue((input, cb) => {
    const { req, res } = input;

    const path = req.body.path; // Get the path from the request body
    const text = req.body.text; // Get the text data from the request body

    // Set up the environment variables for the Python environment
    const env = {
        ...process.env,
        PATH: '/home/junwen/upt_torch_env/bin:' + process.env.PATH,
        // Add any other necessary environment variables here
    };

    // Spawn a shell process to run the chatbot.py script
    const chatbotProcess = spawn('python', ['chatbot.py', '--path', path, '--text', text], {
        stdio: 'pipe',
        env: env
    });

    let output = '';

    // Handle the output from the chatbot process
    chatbotProcess.stdout.on('data', (data) => {
        console.log(`Chatbot output: ${data}`);
        output += data;
    });

    chatbotProcess.stderr.on('data', (data) => {
        console.error(`Chatbot error: ${data}`);
    });

    chatbotProcess.on('close', (code) => {
        // Run the 'clear' command after the chatbot process has closed
        const clearProcess = spawn('clear', [], { stdio: 'ignore' });

        // Send the response back to the client based on the exit code of the chatbot process
        if (code === 0) {
            res.status(200).json({ message: 'Chatbot started successfully.', response: output });
        } else {
            res.status(500).send('Failed to start the chatbot.');
        }

        cb(); // Signal that this task is done
    });
});

app.post('/run-chatbot', (req, res) => {
    // Add the request to the queue
    queue.push({ req, res });
});

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});