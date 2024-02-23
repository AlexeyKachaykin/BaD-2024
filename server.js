const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { findStatistics } = require('./statistics');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(express.static('public'));
app.use(express.static('temp'));
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const filePath = './temp/tempFile.txt';
        fs.writeFileSync(filePath, req.file.buffer.toString());

        const statistics = await findStatistics(filePath);

        // Log the results to a file
        const resultsFilePath = './temp/results.txt';
        fs.writeFileSync(resultsFilePath, JSON.stringify(statistics, null, 2));

        // Send the results file path as a JSON response
        res.json({ resultsFilePath });

    } catch (error) {
        console.error('Error during file upload and processing:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
