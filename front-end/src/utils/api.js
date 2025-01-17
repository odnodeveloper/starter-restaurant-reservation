/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves an existing reservation.
 * @returns {Promise<reservation>}
 *  a promise that resolves to a possibly empty reservation.
 */

export async function getReservation(reservationId, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}`);
  return await fetchJson(url, { headers, signal }, {});
}

/**
 * Saves reservation to database
 * @param reservation
 * The reservation to save
 * @param  signal
 * optional AbortController.signal
 * @returns {Promise<reservation>}
 *  a promise that resolves the saved reservation, which will now have an `id` property.
 */

export const createReservation = async (reservation, signal) => {
  const url = `${API_BASE_URL}/reservations`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  };

  return await fetchJson(url, options);
};

/**
 * Retrieves all existing tables
 * @returns {Promise<[table]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

/**
 * Saves table to database
 * @param table
 * The table to save
 * @param  signal
 * optional AbortController.signal
 * @returns {Promise<table>}
 *  a promise that resolves the saved table, which will now have an `id` property.
 */
export const createTable = async (table, signal) => {
  const url = `${API_BASE_URL}/tables`;
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };

  return await fetchJson(url, options, table);
};

/**
 * @param  reservation_id
 * The reservation id to save
 * @param table_id
 * Updates table to add reservation (seat table)
 * @returns {Promise<table>}
 * a promise that resolves the updated table, which will now have an `reservation_id` property.
 */
export const seatReservation = async (reservation_id, table_id) => {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id } }),
    headers,
  };
  return await fetchJson(url, options, {});
};

/**
 *
 * @param reservation_id
 * The reservation id to update
 * @param status
 * The updated status
 *@param  signal
 * optional AbortController.signal
 * @returns {Promise<reservation>}
 * a promise that resolves the updated reservation, which will now have a new status.
 */
export const updateReservationStatus = async (
  reservation_id,
  status,
  signal
) => {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { status } }),
    headers,
    signal,
  };
  return await fetchJson(url, options, {});
};

/**
 *
 * @param reservation_id
 * The reservation id to cancel
 * @returns {Promise<reservation>}
 * a promise that resolves the updated reservation, which will now have a cancelled status.
 */
export const cancelReservation = async reservation_id => {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { status: "cancelled" } }),
    headers,
  };
  return await fetchJson(url, options, {});
};

/**
 *
 * @param table_id
 * The table id to finish
 * @returns {Promise<Error|*>}
 *  a promise that resolves to an empty object.
 */
export const finishTable = async table_id => {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
  };
  return await fetchJson(url, options);
};

export const searchReservations = async (mobile_number, signal) => {
  const url = `${API_BASE_URL}/reservations?mobile_number=${mobile_number}`;
  return await fetchJson(url, { headers, signal }, []);
};

export const updateReservation = async (
  reservation_id,
  updatedReservation,
  signal
) => {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: updatedReservation }),
    headers,
    signal,
  };
  return await fetchJson(url, options, {});
};