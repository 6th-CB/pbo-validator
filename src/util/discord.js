const Discord = require('discord.js');

let readyListeners = [];
const client = new Discord.Client();
let ready = false;

function init() {
    client.on('ready', () => {
        ready = true;
        readyListeners.forEach(l => l());
        readyListeners = [];
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
}

function getClient() {
    return new Promise(resolve => {
        if (ready) {
            resolve(client);
            return;
        }
        readyListeners.push(() => {
            resolve(client);
        });
    });
}

module.exports = {
    init,
    getClient,
};
