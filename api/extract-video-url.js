const express = require('express');
const { chromium } = require('chrome-aws-lambda'); // Use chrome-aws-lambda

const app = express();
app.use(express.json());

app.post('/extract-video-url', async (req, res) => {
  const { url } = req.body;

  try {
    let browser = null;

    if (process.env.NODE_ENV === 'production') {
      // Use chrome-aws-lambda in production (Vercel)
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
      });
    } else {
      // Use local Puppeteer for development
      browser = await chromium.puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/chromium-browser', // Adjust based on local environment
      });
    }

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the video URL using JavaScript
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
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Backend server running on http://localhost:3000');
});
