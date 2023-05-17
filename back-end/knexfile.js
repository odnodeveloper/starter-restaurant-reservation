/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
  DATABASE_URL = "postgres://pxljyyrr:ETLlLUZugRfFgKnfziNsuEvP81LnxstM@kesavan.db.elephantsql.com/pxljyyrr",
  DATABASE_URL_DEVELOPMENT = "postgres://caatntal:bW7hTHFJRwy6BNzE6E7yNUhMInwX9307@babar.db.elephantsql.com/caatntal",
  DATABASE_URL_TEST = "postgres://qwblzzzl:mn2Sx2VDa2LQDnFJ62soS-BibFK5vtHx@kesavan.db.elephantsql.com/qwblzzzl",
  DATABASE_URL_PREVIEW = "postgres://ugziorvo:2n4LWvWYxcvEeG-U_Y2CPzV_dk1vZMoj@kesavan.db.elephantsql.com/ugziorvo",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
