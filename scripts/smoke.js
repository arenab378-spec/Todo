const puppeteer = require('puppeteer');

(async () => {
  const url = process.env.APP_URL || 'http://localhost:3000';
  console.log('Starting smoke test against', url);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Page loaded');

    // Add a task
    await page.waitForSelector('.input', { timeout: 10000 });
    await page.type('.input', 'Smoke Test Task');
    await page.click('.addBtn');
    console.log('Clicked add');

    // Verify task added
    await page.waitForFunction(() => {
      const el = document.querySelector('.taskItem .taskText');
      return el && el.innerText.includes('Smoke Test Task');
    }, { timeout: 5000 });
    console.log('Task appeared in list');

    // Edit task (double click -> change text -> Enter)
    const taskTextSelector = '.taskItem .taskText';
    await page.click(taskTextSelector, { clickCount: 2 });
    await page.waitForSelector('.editInput', { timeout: 3000 });
    await page.click('.editInput');
    await page.keyboard.press('End');
    await page.keyboard.type(' (edited)');
    await page.keyboard.press('Enter');
    console.log('Edited task');

    // Verify edit
    await page.waitForFunction(() => {
      const el = document.querySelector('.taskItem .taskText');
      return el && el.innerText.includes('(edited)');
    }, { timeout: 5000 });
    console.log('Edit verified');

    // Undo (Ctrl+Z)
    await page.keyboard.down('Control');
    await page.keyboard.press('z');
    await page.keyboard.up('Control');
    console.log('Sent Undo');
    // Wait a moment for undo to apply
    await page.waitForTimeout(800);
    const afterUndo = await page.$eval('.taskItem .taskText', el => el.innerText);
    console.log('After undo task text:', afterUndo);

    // Redo (Ctrl+Shift+Z)
    await page.keyboard.down('Control');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Z');
    await page.keyboard.up('Shift');
    await page.keyboard.up('Control');
    console.log('Sent Redo');
    await page.waitForTimeout(800);
    const afterRedo = await page.$eval('.taskItem .taskText', el => el.innerText);
    console.log('After redo task text:', afterRedo);

    // Delete the task
    await page.click('.taskItem .deleteBtn');
    console.log('Clicked delete');

    // Verify deletion (taskItem should be gone or not contain text)
    const exists = await page.$('.taskItem');
    if (exists) {
      const txt = await page.$eval('.taskItem .taskText', el => el.innerText).catch(()=>'');
      if (txt && txt.includes('Smoke Test Task')) {
        console.error('Task still present after delete');
        await browser.close();
        process.exit(2);
      }
    }

    console.log('Smoke test passed');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Smoke test failed:', err);
    try { await browser.close(); } catch (e) {}
    process.exit(1);
  }
})();
