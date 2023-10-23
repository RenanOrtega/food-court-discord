import { Events } from "discord.js";

export default {
    name: Events.MessageCreate,
    execute(message) {
        if (message.author.bot) return;
        if (message.channelId !== process.env.FOOD_COURT_CHANNEL_ID) return;

        const attachments = message.attachments;

        if (hasImageInMessage(attachments)) {
            attachments.forEach((attachment) => {
                if (attachment.contentType.startsWith('image')) {
                    message.react('👍');
                    message.react('👎');
                }
            });
        } 
    }
}

const hasImageInMessage = (attachments) => attachments.size > 0;