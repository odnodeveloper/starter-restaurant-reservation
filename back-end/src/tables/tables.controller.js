const tablesService = require("./tables.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationsService = require("../reservations/reservations.service");
const reservationsController = require("../reservations/reservations.controller")

const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasReservationId = hasProperties("reservation_id");


async function tableExists(req, res, next) {
  const table_id = Number(req.params.table_id);
  const table = await tablesService.read(table_id);

  if (table.reservation_id) {
    table.reservation = await reservationsService.read(table.reservation_id);
  }

  if (table.table_id) {
    res.locals.table = table;
    return next();
  }

  next({ status: 404, message: `Table ${table_id} cannot be found.` });
}


function hasValidName(req, res, next) {
  const table_name = req.body.data.table_name;

  if (table_name.length < 2) {
    return next({
      status: 400,
      message: `Invalid table_name`,
    });
  }
  next();
}

function hasValidCapacity(req, res, next) {
  const capacity = req.body.data.capacity;

  if (capacity < 1 || isNaN(capacity) || typeof capacity !== "number") {
    return next({
      status: 400,
      message: `Invalid capacity`,
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const reservation_id =
    req.params.reservation_id || (req.body.data || {}).reservation_id;

  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    res.locals.table.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  });
}

function hasSufficientCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.table.reservation.people;

  if (capacity < people) {
    return next({
      status: 400,
      message: `Table does not have sufficient capacity`,
    });
  }
  next();
}

function tableIsFree(req, res, next) {
  if (res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: `Table is occupied`,
    });
  }
  next();
}

function tableIsOccupied(req, res, next) {
  if (!res.locals.table.reservation.reservation) {
    return next({
      status: 400,
      message: `Table is not occupied`,
    });
  }
  next();
}

async function list(req, res) {
  const data = await tablesService.list();
  res.json({ data });
}

async function create(req, res) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const { reservation_id } = req.body.data;
  const data = await tablesService.update(reservation_id, res.locals.table.table_id);
  res.status(200).json({ data });
}

async function finish(req, res) {
  const data = await tablesService.finish(res.locals.table.reservation_id, res.locals.table.table_id);
  res.status(200).json({ data });
}

function tableIsNotSeated(req, res, next) {
  if (res.locals.reservation.status === "seated") {
    return next({
      status: 400,
      message: `Table is already seated`,
    })
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    hasValidName,
    hasValidCapacity,
    asyncErrorBoundary(create)
  ],
  update: [
    asyncErrorBoundary(tableExists),
    hasReservationId,
    reservationExists,
    hasSufficientCapacity,
    tableIsFree,
    asyncErrorBoundary(update),
  ],
  finish: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(finish)
  ],
};
