import 'dotenv/config'
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
    Client, 
    IntentsBitField, 
    Collection 
} from 'discord.js';
import { LoadCommands } from './commands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.commands = new Collection();
const commands = LoadCommands();
for (const command of commands) {
    client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const eventName = path.parse(file).name;
    const eventModule = await import(`./events/${eventName}.js`)
    const event = eventModule.default;

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

await client.login(process.env.DISCORD_TOKEN)