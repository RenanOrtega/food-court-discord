import 'dotenv/config'
import { 
    Client, 
    IntentsBitField, 
    Events, 
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

await client.login(process.env.DISCORD_TOKEN)

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
})

client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;
    if (message.channelId !== '1165690103444819979') return;

    const attachments = message.attachments;

    if (attachments.size > 0) {
        attachments.forEach((attachment) => {
            if (attachment.contentType.startsWith('image/')) {
                message.react('👍');
                message.react('👎');
            }
        });
    }
})

client.once(Events.ClientReady, (c) => {
    console.log(`✔ ${c.user.tag} is online.`)
})
