const puppeteer = require('puppeteer');
const login = '';
const password = '';
const group_url = 'https://vk.com/club209987597';
const text = 
`asmbmb,n,n,n,as
hgj,hg,,j,kjb
mb,bmbmbmbmbmb`;
const postToScroll = 35;
const author = 'Илья Орешкин';
const interval = 1;


async function run() {
	const browser = await puppeteer.launch({
		headless:false, 
		defaultViewport: null, 
		args: [
		'--window-size=1920,1080',
	  ]});
	const page = await browser.newPage();
	await page.goto('https://vk.com');
	await page.type('#index_email', login);
	await page.type('#index_pass', password);
	await page.click('#index_login_button');
	await page.waitForNavigation({timeout: 0});
	await page.goto(group_url);
	
	await page.waitForTimeout(2000);
	while(true) {
		let i = 0;
		let postNumber = 0;
		while(postNumber < postToScroll && i < 8){
			await page.mouse.wheel({deltaY: 1000});
			await page.waitForTimeout(500);
			i++;
			postNumber = await page.evaluate(() => {
				const posts = document.querySelectorAll('.post');
				return posts.length;
			});
			// console.log('i= ' + i);
			// console.log('post = ' + postNumber);
		}

		await page.evaluate((authorName) =>{
			const posts = document.querySelectorAll('.post');
			posts.forEach((elem) =>{
				author = elem.querySelector('.post_author a').textContent;
				if (author == authorName) {
					elem.querySelector('.ui_actions_menu_item').click();
				}
			});
		}, author);
	
		await page.waitForTimeout(2000);
		await page.waitForSelector('#post_field');
		await page.type('#post_field', text);
		await page.click('#send_post');

		await page.waitForTimeout(interval * 60000);
	}
}
run();
