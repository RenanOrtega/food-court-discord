import { Events } from 'discord.js';
import { Foods } from '../sequelize/models/foods.js';
import Classification from '../constants/classification.js';
import Emoji from '../constants/emoji.js';

export default {
    name: Events.MessageReactionAdd,
    async execute(reaction) {
        
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error(error);
                return;
            }
        }

        const message = reaction.message;
        
        if (message.author.bot) return;
        if (message.channelId !== process.env.FOOD_COURT_CHANNEL_ID) return;

        const attachment = message.attachments.first();
        if (!isImage(attachment)) return;

        const reactions = message.reactions.cache;
        const likes = reactions.find(reaction => reaction.emoji.name === Emoji.LIKE).count-1;
        const deslikes = reactions.find(reaction => reaction.emoji.name === Emoji.DESLIKE).count-1;
        const classification = likes > deslikes ? Classification.BEAUTY : Classification.UGLY;

        const food = await Foods.findOne({ where: {message_id: message.id}});
        if (food) {
            await Foods.update({ like: likes, deslike: deslikes, classification: classification }, { where: { message_id: message.id }});
            console.log('Comida atualizada com sucesso!');
        } else {
            await Foods.create({
                message_id: message.id,
                username: message.author.tag,
                description: 'some desc',
                url: attachment.url,
                like: likes,
                deslike: deslikes,
                classification: classification
            })
            console.log('Comida criada com sucesso!');
        }
    }
}

const isImage = (attachment) => attachment.contentType.startsWith('image');