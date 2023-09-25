const puppeteer = require('puppeteer');

async function getIframeContent(url)  {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url);
  
    // Wait for the iframe to load
    const iframeContent = await page.content();
    
    // Get the iframe handle
    // const iframeHandle = await page.$('iframe');
  
    // Evaluate the content inside the iframe
    // const iframeContent = await iframeHandle.contentFrame();
    // const liveIframeContent = await iframeContent.evaluate(() => document.body.innerHTML);
    
    // Close the browser
    // await browser.close();
  
    return iframeContent;
  }

module.exports = getIframeContent;