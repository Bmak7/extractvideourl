const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.get('/extract', async (req, res) => {
  const doodStreamUrl = req.query.url;

  if (!doodStreamUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the PasteDownload site
    await page.goto(`https://pastedownload.com/doodstream-video-downloader/#url=${doodStreamUrl}`, {
      waitUntil: 'networkidle2',
    });

    // Wait for the download link to appear
    await page.waitForSelector('a.btn.btn-success.btn-sq', { timeout: 25000 });

    // Extract the download link
    const downloadLink = await page.evaluate(() => {
      const linkElement = document.querySelector('a.btn.btn-success.btn-sq');
      return linkElement ? linkElement.href : null;
    });

    await browser.close();

    if (downloadLink) {
      res.json({ downloadLink });
    } else {
      res.status(404).json({ error: 'Download link not found' });
    }
  } catch (error) {
    console.error('Error extracting download link:', error);
    res.status(500).json({ error: 'Failed to extract download link' });
  }
});

app.l
