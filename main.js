const { app, Menu, Tray } = require('electron')

const trayIconPath = 'dist/img/icon.png';

const actions = {};

const registerAction = (actionName, fn) => {
    actions[actionName] = fn;
};

const unregisterAction = (actionName, fn) => {
    if (actions[fn] === fn)
        actions[fn] = null;
};

const triggerAction = (actionName, args) => {
    console.log('Trigger action: ' + actionName);
    if (typeof actions[actionName] == 'function')
        actions[actionName](args);
};

const performAction = (actionName, args) => () => triggerAction(actionName, args);

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
                { label: 'Amplifier', type: 'radio', click: performAction('select-zone', { name: 'Amplifier' }) },
                { label: 'Headphones', type: 'radio', click: performAction('select-zone', { name: 'Headphones'}) },
                { label: 'Mac Mini', type: 'radio', checked: true, click: performAction('select-zone', { name: 'Mac Mini' }) }
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
