import 'dotenv/config';
import { 
    Client, 
    IntentsBitField, 
    Collection 
} from 'discord.js';
import { GetCommands } from './commands/index.js';
import { Files, Parse } from './utils/path.js';

class FoodCourtBot extends Client {
    constructor(
        props = {
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ],
        }
    ) {
        super(props);
        this.Build();
    }

    LoadCommands() {
        const commands = GetCommands();
        for (const command of commands) {
            this.commands.set(command.data.name, command);
        }
    }

    async LoadEvents() {
        const eventFiles = Files('events');
    
        for (const file of eventFiles) {
            const eventName = Parse(file);
            const eventModule = await import(`./events/${eventName.name}.js`);
            const event = eventModule.default;
    
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args));
            } else {
                this.on(event.name, (...args) => event.execute(...args));
            }
        }
    }

    Build() {
        console.log("Starting the bot...");
        this.login(process.env.DISCORD_TOKEN);
        
        this.commands = new Collection();

        this.LoadCommands();
        this.LoadEvents();
    }
}

export default FoodCourtBot;
