import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('analyze')
    .setDescription('Analisa uma comida!')
    .addStringOption(option => 
        option
            .setName('message_id')
            .setDescription('Digite um id de mensagem.')
            .setRequired(true))

const execute = async(interaction) => {
    const message_id = interaction.options.getString('message_id');

    try{
        const message = await interaction.channel.messages.fetch(message_id);
        const reactions = message.reactions.cache;
        const response = reactions.map((reaction) => `Reação: ${reaction.emoji.name} - Quantidade: ${reaction.count}\n`);
        await interaction.reply(response.join('\n'));
    } catch {
        await interaction.reply('A mensagem não foi encontrada');
    }
};
 
const ANALYZE_COMMAND = {
    data,
    execute
}

export default ANALYZE_COMMAND;
