const puppeteer = require('puppeteer');
const settings = require('./settings.js')

async function run() {
	const browser = await puppeteer.launch({
		headless : false, 
		defaultViewport : null, 
		args: [
		'--window-size=1920,1080',
	  ]});
	
	const page = await browser.newPage();
	await page.goto('https://vk.com');
	await page.type('#index_email', settings.login);
	await page.type('#index_pass', settings.password);
	await page.click('#index_login_button');
	await page.waitForNavigation({timeout : 0});
	await page.goto(settings.groupUrl);
	
	await page.waitForTimeout(2000);
	while(true) {
		let i = 0;
		let postNumber = 0;
		while(postNumber < settings.postToScroll && i < 10) {
			await page.mouse.wheel({deltaY : 1000});
			await page.waitForTimeout(500);
			i++;
			postNumber = await page.evaluate(() => {
				const posts = document.querySelectorAll('.post');
				return posts.length;
			});
		}

		await page.evaluate((authorName) => {
			const posts = document.querySelectorAll('.post');
			posts.forEach((elem) => {
				author = elem.querySelector('.post_author a').textContent;
				if (author == authorName) {
					elem.querySelector('.ui_actions_menu_item').click();
				}
			});
		}, settings.userName);
	
		await page.waitForTimeout(2000);
		await page.waitForSelector('#post_field');
		await page.type('#post_field', settings.text);
		await page.click('#send_post');

		await page.waitForTimeout(settings.interval * 60000);
	}
}
run();
