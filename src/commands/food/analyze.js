import { SlashCommandBuilder } from 'discord.js';
import { Foods } from '../../sequelize/models/foods.js';
import Classification from '../../constants/classification.js';
import Emoji from '../../constants/emoji.js';

const data = new SlashCommandBuilder()
    .setName('analyze')
    .setDescription('Analisa uma comida!')
    .addStringOption(option => 
        option
            .setName('message_id')
            .setDescription('Digite um id de mensagem.')
            .setRequired(true))

const execute = async(interaction) => {
    try {
        const message_id = interaction.options.getString('message_id');
        const message = await interaction.channel.messages.fetch(message_id);

        const attachment = message.attachments.first();
        if (!isImage(attachment)) {
            await interaction.reply('Somente imagens podem ser analisadas!');
        }

        const reactions = message.reactions.cache;
        const likes = reactions.find(reaction => reaction.emoji.name === Emoji.LIKE).count-1;
        const deslikes = reactions.find(reaction => reaction.emoji.name === Emoji.DESLIKE).count-1;
        const classification = likes > deslikes ? Classification.BEAUTY : Classification.UGLY;

        const food = await Foods.findOne({ where: {message_id: message_id}});
        if (food) {
            await Foods.update({ like: likes, deslike: deslikes, classification: classification }, { where: { message_id: message_id }});
            console.log('Comida atualizada com sucesso!');
            await interaction.reply('Comida analisada e atualizada com sucesso!');
        } else {
            await Foods.create({
                message_id: message_id,
                username: interaction.user.tag,
                description: 'some desc',
                url: attachment.url,
                like: likes,
                deslike: deslikes,
                classification: classification
            })

            await interaction.reply('Comida analisada e adicionada no ranking com sucesso!');
        }
    } catch (error) {
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('MessageId Duplicated');
            throw new Error(error);
        }

        console.log(error)
        await interaction.reply('A mensagem não foi encontrada');
    }
};

const isImage = (attachment) => attachment.contentType.startsWith('image');

const ANALYZE_COMMAND = {
    data,
    execute
}

export default ANALYZE_COMMAND;
