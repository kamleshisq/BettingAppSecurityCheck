const puppeteer = require('puppeteer');
const timeout = 60000;
let startTime = Date.now()

async function getIframeContent(url) {
    console.log(url)
    const browser = await puppeteer.launch({  headless: 'new'});
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto('https://stackoverflow.com/questions/5902008/show-id-for-image-clicked');
  
    // Wait for the iframe to load
    // await page.waitForSelector('iframe');
    while (Date.now() - startTime < timeout) {
        try {
          await page.waitForSelector('iframe', { timeout: 1000 }); // Check for the iframe every second
          break; // Break the loop if the iframe is found
        } catch (error) {
          // Ignore the timeout error and continue the loop
          console.log('err', error)
        }
      }
    
    // Get the iframe handle
    const iframeHandle = await page.$('iframe');
  
    // Evaluate the content inside the iframe
    const iframeContent = await iframeHandle.contentFrame();
    const liveIframeContent = await iframeContent.evaluate(() => document.body.innerHTML);
    
    // Close the browser
    await browser.close();
    console.log(liveIframeContent, 123)
  
    return liveIframeContent;
  }

module.exports = getIframeContent;