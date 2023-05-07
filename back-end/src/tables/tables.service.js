const knex = require("../db/connection.js");

const tableName = "tables";

function list() {
  return knex(tableName)
    .select("*")
    .orderBy("table_name");
}

function read(table_id) {
  return knex(tableName)
    .select("*")
    .where({ table_id })
    .first();
}

function create(table) {
  return knex(tableName)
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function update(reservation_id, table_id) {
  return knex.transaction(async (trx) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .transacting(trx);

    return knex(tableName)
      .select("*")
      .where({ table_id })
      .update({ reservation_id: reservation_id }, "*")
      .update({
        occupied: knex.raw("NOT ??", ["occupied"]),
      })
      .transacting(trx)
      .then((createdRecords) => createdRecords[0]);
  });
}

function finish(reservation_id, table_id) {
  return knex.transaction(async (trx) => {
    await knex("reservations")
      .where({ reservation_id })
      .update({ status: "finished" })
      .transacting(trx);

    return knex(tableName)
      .select("*")
      .where({ table_id })
      .update({ reservation_id: null }, "*")
      .update({
        occupied: knex.raw("NOT ??", ["occupied"]),
      })
      .transacting(trx)
      .then((createdRecords) => createdRecords[0]);
  });
}

module.exports = {
  list,
  read,
  create,
  update,
  finish,
};
