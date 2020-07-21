import {app, BrowserWindow, ipcMain, globalShortcut} from 'electron'
import { autoUpdater } from 'electron-updater';

import puppeteer from 'puppeteer';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        height: 600,
        frame: false,
        useContentSize: true,
        width: 1000,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        }
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    });

    /*const ret = globalShortcut.register('CommandOrControl+Shift+I', () => {
        mainWindow.webContents.toggleDevTools();
    });*/
}

app.on('ready', async () => {
    createWindow();
    /*if (process.env.NODE_ENV === 'production')*/ await autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})

async function sendMail(naver_id, naver_pw) {
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

ipcMain.on('crawlEmail', async (event, {id, pw}) => {
    const result = await sendMail(id, pw);
    event.sender.send('crawlEmailEnd', result);
});

ipcMain.on('app_version', (event) => {
   event.sender.send('app_version', { version: app.getVersion()});
});

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
