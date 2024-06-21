const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html as the root file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/download', async (req, res) => {
    const videoUrl = req.body.url;

    if (!ytdl.validateURL(videoUrl)) {
        return res.json({ success: false, message: 'Invalid URL' });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
        res.json({ success: true, downloadUrl: format.url });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
