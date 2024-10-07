require("dotenv").config();
const log = require("./logging");

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: (msg) => {
      log.loggerQuery.log({
        level: "info",
        label: "",
        message: msg,
      });
    },
    timezone: "Asia/Jakarta",
    dialectOptions: {
      timezone: "local",
    },
    databases: {
      node_mention: {
        username: process.env.DB2_USERNAME,
        password: process.env.DB2_PASSWORD,
        database: process.env.DB2_DATABASE,
        host: process.env.DB2_HOST,
        dialect: "mysql",
        timezone: "Asia/Jakarta",
        dialectOptions: {
          timezone: "local",
        },
      },
    },
  },

  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Asia/Jakarta",
    dialectOptions: {
      timezone: "local",
    },
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
    timezone: "Asia/Jakarta",
    dialectOptions: {
      timezone: "local",
    },
  },
};
