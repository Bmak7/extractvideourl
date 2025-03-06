const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Example: Extract the video URL
    const videoUrl = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      return videoElement ? videoElement.src : null;
    });

    await browser.close();

    if (videoUrl) {
      res.json({ videoUrl });
    } else {
      res.status(404).json({ error: 'Video URL not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to scrape the page' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
