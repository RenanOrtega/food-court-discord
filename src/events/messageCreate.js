import { Events } from "discord.js";

export default {
    name: Events.MessageCreate,
    execute(message) {
        if (message.author.bot) return;
        if (message.channelId !== process.env.FOOD_COURT_CHANNEL_ID) return;

        const attachment = message.attachments.first();

        if (isImage(attachment)) {
            message.react('👍');
            message.react('👎');
            return;
        }
        
        message.reply('Somente imagens podem ser analisadas!');
    }
}

const isImage = (attachment) => attachment.contentType.startsWith('image');
