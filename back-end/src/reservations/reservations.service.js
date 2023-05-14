const knex = require("../db/connection.js");

const tableName = "reservations";

function list(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function search(mobile_number) {
  return knex(tableName)
    .whereRaw("translate(mobile_number, '() -', '') like ?", `%${mobile_number.replace(/\D/g, "")}%`)
    .orderBy("reservation_date");
}

function read(reservation_id) {
  return knex(tableName).select("*").where({ reservation_id }).first();
}

function create(reservation) {
  return knex(tableName)
    .insert(reservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

function update(updatedRes) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id: updatedRes.reservation_id })
    .update(updatedRes, "*")
    .then((createdRecords) => createdRecords[0]);
}

function updateStatus(reservation_id, status) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id })
    .update({ status: status }, "*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  search,
  read,
  create,
  update,
  updateStatus,
};
