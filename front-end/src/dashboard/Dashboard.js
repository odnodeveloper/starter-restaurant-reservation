import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  cancelReservation,
  finishTable,
  listReservations,
  listTables,
} from "../utils/api";
import useQuery from "../utils/useQuery";
import { next, previous, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TablesList from "../tables/TablesList";
import TimeDisplay from "./TimeDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
const Dashboard = ({ date }) => {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [tablesLoading, setTablesLoading] = useState(true);
  const history = useHistory();
  const query = useQuery();

  if (query.get("date")) {
    date = query.get("date");
  }

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  // Loads reservations from database on page load
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsLoading(true);
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(reservations => {
        setReservations(reservations);
        setReservationsLoading(false);
      })
      .catch(setReservationsError);
    return () => {
      abortController.abort();
    };
  }

  // Loads tables from database on page load
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    setTablesLoading(true);
    listTables(abortController.signal)
      .then(tables => {
        setTables(tables);
        setTablesLoading(false);
      })
      .catch(setTablesError);
    return () => {
      abortController.abort();
    };
  }

  // Handlers for changing dates
  const todayButtonHandler = () => {
    history.push("/dashboard");
  };

  const previousDayButtonHandler = () => {
    setReservationsLoading(true);
    const previousDay = previous(date);
    history.push(`/dashboard?date=${previousDay}`);
  };

  const nextDayButtonHandler = () => {
    setReservationsLoading(true);
    const nextDay = next(date);
    history.push(`/dashboard?date=${nextDay}`);
  };

  // Handler for finishing table
  const finishButtonHandler = id => {
    const confirm = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirm) {
      finishTable(id)
        .then(() => {
          loadTables();
          loadDashboard();
        })
        .catch(setTablesError);
    }
  };

  // Handler for canceling a reservation
  const cancelButtonHandler = id => {
    const confirm = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (confirm) {
      cancelReservation(id)
        .then(() => loadDashboard())
        .catch(setReservationsError);
    }
  };

  // Formats and displays the date based on query parameter, today if viewing current date
  const getDisplayDate = () => {
    let displayDate = new Date(date.replace(/-/g, "/")).toLocaleDateString(
      "en-US"
    );
    if (!query.get("date") || query.get("date") === today()) {
      displayDate = "Today";
    }
    return displayDate;
  };

  const loadedTables = () => {
    return tablesLoading ? (
      <div>Loading...</div>
    ) : (
      <TablesList tables={tables} finishButtonHandler={finishButtonHandler} />
    );
  };

  return (
    <main className="container-lg">
      <header className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center flex-wrap px-2 px-md-0 py-4 m-0">
        <h1 className="mb-2">Dashboard</h1>
        <div className="d-flex flex-column">
          <h3>
            {new Date().toLocaleDateString("us-EN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="text-sm-end m-0">
            <TimeDisplay />
          </div>
        </div>
      </header>

      <ErrorAlert error={reservationsError} />
      <div className="reservation-container p-3 p-md-4">
        <div className="d-flex flex-column flex-sm-row justify-content-sm-between mb-3">
          <div className="date-buttons col-sm-4 d-flex flex-row mb-2 mb-sm-0">
            <button
              type="button"
              className="btn btn-outline-primary me-1 flex-sm-grow-0 flex-grow-1"
              onClick={() => previousDayButtonHandler()}
            >
              Prev
            </button>
            <button
              type="button"
              className="btn btn-outline-primary me-1 flex-sm-grow-0 flex-grow-1"
              onClick={() => todayButtonHandler()}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-outline-primary flex-sm-grow-0 flex-grow-1"
              onClick={() => nextDayButtonHandler()}
            >
              Next
            </button>
          </div>
          <button
            type="button"
            name="New Reservation"
            className="btn btn-primary "
            onClick={() => history.push("/reservations/new")}
          >
            <i className="bi bi-plus-circle-fill me-2"></i>New Reservation
          </button>
        </div>
        <div className="col col-sm-7 d-md-flex flex-column align-items-start">
          <h2>Reservations for {getDisplayDate()}</h2>
        </div>
        <ReservationsList
          reservations={reservations}
          cancelButtonHandler={cancelButtonHandler}
          reservationsLoading={reservationsLoading}
          hasTables={!!tables.length}
        />
      </div>

      <ErrorAlert error={tablesError} />
      {loadedTables()}
    </main>
  );
};

export default Dashboard;