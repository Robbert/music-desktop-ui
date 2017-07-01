const { app, Menu, Tray } = require('electron')
const path = require('path');

const trayIconPath = path.resolve(__dirname, 'img/generated/16x16.png');

const actions = {};

const registerAction = (actionName, fn) => {
    actions[actionName] = fn;
};

const unregisterAction = (actionName, fn) => {
    if (actions[fn] === fn)
        actions[fn] = null;
};

const triggerAction = (actionName) => {
    console.log('Trigger action: ' + actionName);
    if (typeof actions[actionName] == 'function')
        actions[actionName].apply(null, arguments);
};

const performAction = actionName => () => triggerAction(actionName);

// I think it is necessary to put `tray` in the global scope,
// to prevent it from being garbage collected and destroyed.
let tray;

const initSystemTray = () => {
    tray = new Tray(trayIconPath);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Play anything',
            click: performAction('play')
        },
        {
            type: 'separator'
        },
        {
            label: 'Pause',
            disabled: true,
            click: performAction('pause')
        },
        {
            label: 'Pause after this',
            disabled: true,
            click: performAction('schedule-break')
        },
        {
            label: 'Skip this track',
            disabled: true,
            click: performAction('next')
        },
        {
            type: 'separator'
        },
        {
            label: 'Ban this track',
            disabled: true,
            click: performAction('ban')
        },
        {
            label: 'Like this track',
            disabled: true,
            click: performAction('like')
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

    tray.setContextMenu(contextMenu);
};

app.on('ready', () => {
    initSystemTray();

    triggerAction('init');
});

module.exports = {
    registerAction
};