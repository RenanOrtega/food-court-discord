import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Reply with pong!');

const execute = async(interaction) => {
    await interaction.reply('Pong!');
};

const PING_COMMAND = {
    data,
    execute
}

export default PING_COMMAND;
