import 'dotenv/config'
import path from 'path';
import fs from 'fs';
import __dirname from './utils/dirname.js'
import Client from './client.js';

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const eventName = path.parse(file).name;
    const eventModule = await import(`./events/${eventName}.js`)
    const event = eventModule.default;

    if (event.once) {
        Client.once(event.name, (...args) => event.execute(...args));
    } else {
        Client.on(event.name, (...args) => event.execute(...args));
    }
}

await Client.login(process.env.DISCORD_TOKEN)