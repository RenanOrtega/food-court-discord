import { Events } from "discord.js";
import { Foods } from "../sequelize/models/foods.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        Foods.sync();
        console.log(`✔ ${client.user.tag} is online.`)
    }
}