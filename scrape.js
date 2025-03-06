const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to the URL
  await page.goto('https://ak.sv/watch/148157/80405/the-walking-dead-daryl-dixon-%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%85-%D8%A7%D9%84%D8%A7%D9%88%D9%84/%D8%A7%D9%84%D8%AD%D9%84%D9%82%D8%A9-1');

  // Wait for the page to load (adjust the selector as needed)
  await page.waitForSelector('video');

  // Extract the video URL
  const videoUrl = await page.evaluate(() => {
    const videoElement = document.querySelector('video');
    return videoElement ? videoElement.src : null;
  });

  console.log('Video URL:', videoUrl);

  await browser.close();
})();
