const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    function getMusicDetails() {
        const musicBar = document.getElementsByTagName('ytmusic-player-bar')[0];
        const progressBarAttr = (x) => musicBar.querySelector('tp-yt-paper-slider[id="progress-bar"]')?.attributes[x]?.value;
        const musicDetails = {
            name: musicBar.querySelector('yt-formatted-string[class="title style-scope ytmusic-player-bar"]').innerText,
            artists: musicBar.querySelector('yt-formatted-string[class="byline style-scope ytmusic-player-bar complex-string"]').querySelector('a').innerText,
            imageUrl: musicBar.querySelector('img[class="image style-scope ytmusic-player-bar"]').src,
            times: {
                musicMin: progressBarAttr('aria-valuemin'),
                musicMax: progressBarAttr('aria-valuemax'),
                musicNow: progressBarAttr('aria-valuenow')
            }
        }

        return musicDetails;
    }

    setInterval(() => ipcRenderer.send('music', getMusicDetails()), 1000);
});