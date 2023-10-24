import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Foods } from '../../sequelize/models/foods.js';
import Emoji from '../../constants/emoji.js';
import Classification from '../../constants/classification.js';

const data = new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lista o ranking de comidas!')
    .addStringOption(option => 
        option.setName('classification')
            .setDescription('A classificação da comida.')
            .setRequired(true)
            .addChoices(
                { name: 'comidas bonitas', value: Classification.BEAUTY},
                { name: 'comidas feias', value: Classification.UGLY},
            ));

const execute = async(interaction) => {
    const classification = interaction.options.getString('classification');
    const order = classification === Classification.BEAUTY ? 'like' : 'deslike';

    let descriptions = '';
    let usernames = '';
    let likes = '';
    let deslikes = '';
    let i = 0;
    let top1 = '';

    const foods = await Foods.findAll({
        where: {classification: classification},
        order: [[order, 'DESC']],
        limit: 5,
    });
    
    for (const food of foods) {
        i += 1;

        if (i===1) {
            top1 = food.url
        }

        descriptions += `\`${i}\` [${food.description}](${food.url})\n`;
        usernames += `${food.username}\n`;
        likes += `${food.like}\n`;
        deslikes += `${food.deslike}\n`;
    }
    const embed = new EmbedBuilder();

    if (classification === Classification.BEAUTY){
        embed
            .setColor('#FEE75C')
            .setTitle('Top 5')
            .setAuthor({name: 'Ranking Comidas Bonitas', iconURL: 'https://static.wikia.nocookie.net/supermarioglitchy4/images/b/b6/8ED4E41C-F0F1-49FA-9AC7-08FC9EE5F755.png/revision/latest/scale-to-width-down/1200?cb=20200209125017'})
            .addFields(
                { name: 'Descriptions', value: descriptions, inline: true },
                { name: 'Users', value: usernames, inline: true },
                { name: 'Likes', value: likes, inline: true },
            )
            .setImage(top1)
            .setTimestamp();
    } else {
        embed
            .setColor('#D2691E')
            .setTitle('Top 5')
            .setAuthor({name: 'Ranking Comidas Feias', iconURL: 'https://render.fineartamerica.com/images/rendered/default/poster/8/8/break/images/artworkimages/medium/2/smelly-pile-of-poop-csa-images.jpg'})
            .addFields(
                { name: 'Descriptions', value: descriptions, inline: true },
                { name: 'Users', value: usernames, inline: true },
                { name: 'Deslikes', value: deslikes, inline: true },
            )
            .setImage(top1)
            .setTimestamp();
    }

    
    return interaction.reply({ embeds: [embed]});
};

const LIST_COMMAND = {
    data,
    execute
}

export default LIST_COMMAND;
