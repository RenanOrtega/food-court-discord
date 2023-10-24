import { db } from '../connection.js';
import { Sequelize } from "sequelize";

export const Foods = db.define('foods', {
    message_id: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: false,
    },
    username: Sequelize.STRING,
    description: Sequelize.TEXT,
    url: Sequelize.STRING,
    like: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    deslike: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    classification: {
        type: Sequelize.STRING,
        allowNull: true
    },
});