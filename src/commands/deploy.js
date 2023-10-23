import 'dotenv/config'
import { REST, Routes } from 'discord.js';
import { GetCommands } from './index.js';

const commands = GetCommands();
const commandsJson = []
for (const command of commands) {
    commandsJson.push(command.data.toJSON())
}

const rest = new REST()
    .setToken(process.env.DISCORD_TOKEN);

(async () => {
    try{
        console.log('Registering commands...')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commandsJson },
        );
        console.log('Commands registered succesfully!')
    } catch (error) {
        console.error(error);
    }
})();