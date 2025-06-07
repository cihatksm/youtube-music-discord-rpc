import { Client } from "@xhayper/discord-rpc";
import { ActivityType } from "discord-api-types/v10";
import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Store from 'electron-store';
import 'colors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();
let client;

const developerMode = process.env.npm_lifecycle_event === 'dev';
const DevLog = (content) => developerMode ? console.log('</> '.green, content) : null;

function discordConnection() {
    client = new Client({ clientId: "1380509208176365789" });
    client.login().then(() => DevLog('Discord RPC Connected')).catch(console.error);
}

function setActivity(data) {
    if (!client?.user) return;

    client.user?.setActivity({
        ...data,
        type: ActivityType.Listening,
        instance: false,
    });
}

let oldMusicData = null;
let pauseChecker = 0;

function setMusicForActivity(data) {
    if (!oldMusicData) {
        oldMusicData = data;
        return setActivity({ details: 'Youtube Music' });
    }

    const object = {
        details: data.name,
        state: data.artists,
        largeImageKey: data.imageUrl,
        startTimestamp: Date.now() - (Number(data.times.musicNow) * 1000),
        endTimestamp: Date.now() + (Number(data.times.musicMax) * 1000) - (Number(data.times.musicNow) * 1000)
    }

    const isEqualDetails = oldMusicData?.name == data.name && oldMusicData?.artists == data.artists;
    if (isEqualDetails) {
        const isPaused = Number(oldMusicData.times.musicNow) == Number(data.times.musicNow);

        if (isPaused) {
            pauseChecker = pauseChecker + 1;
            if (pauseChecker == 2) {
                DevLog('Music Paused');
                return setActivity({ details: 'Youtube Music' });
            }

            return;
        }

        DevLog('Music Playing');

        oldMusicData = data;
        pauseChecker = 0;
        return setActivity(object);
    } else {
        DevLog('Music Changed');

        oldMusicData = data;
        return setActivity(object);
    }
}

function createWindow() {
    const { height: screenHeight, width: screenWidth } = (screen.getPrimaryDisplay()).workAreaSize;

    // Get saved window bounds or use defaults
    const savedBounds = store.get('windowBounds', {
        width: screenHeight <= 720 ? screenWidth : screenHeight <= 1080 ? Math.floor(screenWidth / 3 * 2) : Math.floor(screenWidth / 2),
        height: screenHeight <= 720 ? screenHeight : screenHeight <= 1080 ? Math.floor(screenHeight / 3 * 2) : Math.floor(screenHeight / 2),
        x: undefined,
        y: undefined
    });

    const window = new BrowserWindow({
        ...savedBounds,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets/icon.png'),
        autoHideMenuBar: true,
        frame: true
    });

    // Save window bounds when window is moved or resized
    window.on('moved', () => {
        store.set('windowBounds', window.getBounds());
    });

    window.on('resize', () => {
        store.set('windowBounds', window.getBounds());
    });

    window.loadURL('http://music.youtube.com');
    ipcMain.on('music', (_, data) => setMusicForActivity(data));

    discordConnection();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})