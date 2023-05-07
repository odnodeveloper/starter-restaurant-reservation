import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation, listTables, seatReservation } from "../utils/api";

const SeatReservation = () => {
    const { reservation_id } = useParams();
    const history = useHistory();

    const [reservation, setReservation] = useState({});
    const [reservationLoaded, setReservationLoaded] = useState(false);
    const [reservationError, setReservationError] = useState(null);
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const [selectedTable, setSelectedTable] = useState("");
    const [selectedTableError, setSelectedTableError] = useState(null);

    useEffect(loadTables, []);
    useEffect(loadReservations, [reservation_id]);

    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal).then(setTables).catch(setTablesError);
        return () => abortController.abort();
    }

    function loadReservations() {
        const abortController = new AbortController();
        setReservationError(null);
        getReservation(reservation_id, abortController.signal)
            .then(foundReservation => {
                setReservationLoaded(true);
                setReservation(foundReservation);
            })
            .catch(setReservationError);
        return () => abortController.abort();
    }

    const handleTableChange = event => setSelectedTable(event.target.value);

    const handleCancel = () => history.goBack();

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await seatReservation(reservation_id, selectedTable);
            history.push("/");
        } catch (error) {
            setSelectedTableError(error);
        }
    };

    return (
        <div className="container ">
            <ErrorAlert error={reservationError} />
            <ErrorAlert error={tablesError} />
            <ErrorAlert error={selectedTableError} />
            <div>
                <h1 className="my-4">Seat Reservation</h1>
                <div className="form-container p-4 p-md-5">
                    {reservationLoaded && (
                        <form
                            className="d-flex flex-column align-items-center"
                            onSubmit={handleSubmit}
                        >
                            <div className="col-12 col-sm-10 col-lg-5 d-flex flex-column mb-3">
                                <label htmlFor="table_id" className="me-2">
                                    <h3>
                                        Choose a table to seat {reservation.first_name}{" "}
                                        {reservation.last_name}
                                    </h3>
                                </label>
                                <select
                                    id="table_id"
                                    name="table_id"
                                    value={selectedTable}
                                    onChange={handleTableChange}
                                    className="form-select mt-2 p-2"
                                >
                                    <option key="0" value="">
                                        Select a Table:
                                    </option>
                                    {tables.map(table => {
                                        return (
                                            <option key={table.table_id} value={table.table_id}>
                                                {table.table_name} - {table.capacity}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="col-12 col-sm-10 col-lg-5 d-flex justify-content-sm-end">
                                <button
                                    className="btn btn-secondary flex-grow-1 flex-md-grow-0 me-1"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary flex-grow-1 flex-md-grow-0 ms-1"
                                    type="submit"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SeatReservation;