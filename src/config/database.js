import { Sequelize } from "sequelize";

const storagePath = process.env.NODE_ENV === 'test' ? ':memory:' : './database.sqlite';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
    foreignKeys: false
});

export default sequelize;