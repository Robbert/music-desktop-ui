const musicController = require('./main.js');
const _ = require('lodash');
const RoonApi = require('node-roon-api');
const RoonApiTransport = require('node-roon-api-transport');
const RoonApiStatus = require('node-roon-api-status');

const config = {
    extension_id:        'nl.robbertbroersma',
    display_name:        'Roon System Tray',
    display_version:     '0.0.1',
    publisher:           'Robbert Broersma',
    email:               'robbert@example.com',
    website:             'https://github.com/robbert/music-desktop-ui'
};

let roon;

const init = () => {
    roon = new RoonApi(Object.assign({
        core_paired: (core) => {
            let currentZone = null;
            let currentZoneId = null;

            const play = () => core.services.RoonApiTransport.control(currentZoneId, 'play');
            const pause = () => core.services.RoonApiTransport.control(currentZoneId, 'pause');

            musicController.registerAction('play', play);
            musicController.registerAction('pause', pause);

            let zones = {};
            core.services.RoonApiTransport.subscribe_zones((response, msg) => {
                if (response == 'Subscribed') {
                    let curZones = msg.zones.reduce((p,e) => (p[e.zone_id] = e) && p, {});
                    zones = curZones;
                } else if (response == 'Changed') {
                    var z;
                    if (msg.zones_removed) msg.zones_removed.forEach(e => delete(zones[e.zone_id]));
                    if (msg.zones_added)   msg.zones_added  .forEach(e => zones[e.zone_id] = e);
                    if (msg.zones_changed) msg.zones_changed.forEach(e => zones[e.zone_id] = e);
                }

                _.forEach(zones, zone => {
                    const matchesZone = /Amplifier/.test(zone.display_name);
                    currentZoneId = matchesZone ? zone.zone_id : currentZoneId;
                    currentZone = matchesZone ? zone : currentZone;
                });

                console.log('Current zone: ', currentZone && currentZone.display_name);
            });
        },
        core_unpaired: () => null
    }, config));

    let status = new RoonApiStatus(roon);

    roon.init_services({
       required_services: [ RoonApiTransport ],
       provided_services: [ status ]
    });

    status.set_status('Extension enabled', false);

    roon.start_discovery();
};

musicController.registerAction('init', init);