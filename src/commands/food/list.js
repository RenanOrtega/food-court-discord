import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Foods } from '../../sequelize/models/foods.js';

const data = new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lista o ranking de comidas!');

const execute = async(interaction) => {
    const foodList = await Foods.findAll({ attributes: ['message_id', 'username', 'like', 'deslike']});
    const foodString = foodList.map((food) => `MessageId: ${food.message_id} | Username: ${food.username} | Likes: ${food.like} | Deslikes: ${food.deslike}`).join('\n') || 'Sem comidas.';
    
    const embed = new EmbedBuilder()
        .setColor('#FEE75C')
        .setTitle('Top 5')
        .setAuthor({name: 'Ranking', iconURL: 'https://static.wikia.nocookie.net/supermarioglitchy4/images/b/b6/8ED4E41C-F0F1-49FA-9AC7-08FC9EE5F755.png/revision/latest/scale-to-width-down/1200?cb=20200209125017'})
        .setThumbnail('https://e7.pngegg.com/pngimages/825/591/png-clipart-trophy-medal-golden-cup-golden-cup-prize-thumbnail.png')
        .addFields(
            { name: 'teste', value: foodString}
        )
        .setTimestamp();
    
    return interaction.reply({ embeds: [embed]});
};

const LIST_COMMAND = {
    data,
    execute
}

export default LIST_COMMAND;
