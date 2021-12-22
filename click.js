const puppeteer = require('puppeteer');
 
const login = '+79504793723';
const pass = '@0105Girl';
const authorName = 'А';
 
const community = 'https://vk.com/club149571017';//'https://vk.com/dorogaperm'
 
const text = 
`cxz.vnxc;vkljnvb;lxjknvb
dslkjdlgj
flkgvsdflgjl`;

const postsNumber = 1;

//**************************** */
 
const clicker = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport:{
            width:1280,
            height: 800
        }
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(100000);
    //login
    await page.goto('https://vk.com/login');
    await page.waitForSelector('#email');
    await page.focus('#email');
    await page.keyboard.type(login);
    await page.waitForTimeout(2000);
    await page.waitForSelector('#pass');
    await page.focus('#pass');
    await page.keyboard.type(pass);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(15000);
    //open community page
    await page.goto(community);
    await page.waitForTimeout(5000);

    // scroll to 30 posts
    let i = 1;
    
    let posts = await page.$$('.post');

    while(posts.length < postsNumber){
        
        await page.mouse.wheel({deltaY: 400});

        console.log('Try scroll ' + i + 'time');
        console.log(posts.length);

        if (++i > 10) break;

        await page.waitForTimeout(1000);

        posts = await page.$$('.post');
    }
 
    // find old post
    const oldPostId = await page.evaluate((authorName)=>{
        const posts = document.querySelectorAll('.post');
        let id = '';

        posts.forEach((post)=>{

            let author = post.querySelector('.post_author a');
            
            if(author.textContent == authorName) {
               id = post.id;
            };
        });
        return {id: id};
    }, authorName);
    
    // delete old post
    await page.hover('#' + oldPostId.id);
    page.waitForTimeout(2000);
    let t = await page.waitForSelector('#' + oldPostId.id + ' > div > div.PostHeader.PostHeader--legacy.PostHeader--inPost.js-PostHeader > div.PostHeaderActions.PostHeaderActions--inPost.PostHeaderActions--legacy > div > div > div > div > a');
    console.log(t);
    await page.click('#' + oldPostId.id + ' > div > div.PostHeader > div.PostHeaderActions > div > div > div > div > a');


 
    // send new post
 
    await page.waitForSelector('#post_field');
    await page.focus('#post_field');
    await page.keyboard.type(text);
    await page.click('#send_post');
 
    //TODO extract renewing post to func 
    // and run by setInterval  
    
}
clicker();