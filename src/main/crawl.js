import puppeteer from 'puppeteer';

/* this for test*/
export async function sendMail(naver_id, naver_pw) {
    let result = [];

    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked')
    });
    const page = await browser.newPage();
    await page.goto('https://nid.naver.com/nidlogin.login');
    await page.evaluate((id, pw) => {
        document.querySelector('#id').value = id;
        document.querySelector('#pw').value = pw;
    }, naver_id, naver_pw);
    await page.click('.btn_global');
    await page.waitForNavigation();
    await page.goto('https://naver.com');
    const isLoggedIn = await page.evaluate(() => {
        return !document.querySelector('.link_login');
    });
    if (isLoggedIn) {
        await page.screenshot({path: 'naver.png', fullPage: true});
        await page.goto('https://mail.naver.com/');
        await page.click('.item_wrap.bu2');
        result = await page.evaluate(() => {
            const arr = [];
            const els = document.querySelector('.mailList.sender_context').children;
            for (let i = 0; i < els.length; i++) {
                const el = els[i];
                const title = el.querySelector('.mTitle');
                const name = title.querySelector('.name').querySelector('a').innerText;
                const subject = title.querySelector('.subject').children[0].children[0].children[1].innerText;
                arr.push({
                    title: name,
                    subtitle: subject,
                });
            }
            return arr;
        });
    }
    await browser.close();

    return {isLoggedIn, result};
}