const { app, Menu, Tray } = require('electron')

const trayIconPath = 'dist/img/icon.png';

app.on('ready', () => {
    const appIcon = new Tray(trayIconPath)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Play anything'
        },
        {
            type: 'separator'
        },
        {
            label: 'Pause',
            disabled: true
        },
        {
            label: 'Pause after this',
            disabled: true
        },
        {
            label: 'Skip this track',
            disabled: true
        },
        {
            type: 'separator'
        },
        {
            label: 'Ban this track',
            disabled: true
        },
        {
            label: 'Like this track',
            disabled: true
        },
        {
            type: 'separator'
        },
        {
            label: 'Choose device',
            submenu: [
                { label: 'Amplifier', type: 'radio' },
                { label: 'Headphones', type: 'radio' },
                { label: 'This Mac', type: 'radio', checked: true }
            ]
        }
    ]);

    appIcon.setContextMenu(contextMenu)
});