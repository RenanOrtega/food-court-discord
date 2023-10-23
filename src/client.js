import { 
    Client, 
    IntentsBitField, 
    Collection 
} from 'discord.js';
import { LoadCommands } from './commands.js';

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

export default client;