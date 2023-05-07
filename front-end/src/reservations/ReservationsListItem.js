import React from "react";
import { Link } from "react-router-dom";
import "./ReservationsListItem.css";

/**
 * Defines a reservation returned from the database
 * @param reservation
 * A reservation object
 * @param cancelButtonHandler
 * Click handler function for cancel button
 * @param hasTables
 * Boolean to determine if there are any tables to seat guests
 * @returns {JSX.Element}
 */
const ReservationsListItem = ({
    reservation,
    cancelButtonHandler,
    hasTables,
}) => {
    const reservation_id = reservation.reservation_id;

    const formatTime = () => {
        const time = new Date(`1/1/00 ${reservation.reservation_time}`);
        const options = {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        };
        return time.toLocaleString("en-US", options);
    };

    if (reservation.status === "booked") {
        return (
            <div className="card d-flex flex-row flex-wrap justify-content-between p-3 p-md-4 mb-1">
                <div className="col-12 col-md-6 col-xl-8 d-flex flex-row flex-wrap">
                    <div className="d-flex align-items-xl-center col-5 col-sm-4 col-xl-2 pb-2 p-xl-0">
                        <p className="p-bold">
                            <i className="bi bi-clock me-2"></i>
                            {formatTime(reservation.reservation_time)}
                        </p>
                    </div>
                    <div className="d-flex align-items-xl-center col-7 col-sm-8 col-xl-4">
                        <p>
                            <i className="bi bi-person me-2"></i>
                            {reservation.first_name} {reservation.last_name} (
                            {reservation.people})
                        </p>
                    </div>
                    <div className="d-flex align-items-xl-center col-5 col-sm-4 col-xl-3 order-xl-3">
                        <p data-reservation-id-status={reservation_id}>
                            <i className="bi bi-clipboard-check me-2"></i>
                            {reservation.status[0].toUpperCase() +
                                reservation.status.substring(1)}
                        </p>
                    </div>
                    <div className="d-flex align-items-xl-center col-7 col-sm-8 col-xl-3">
                        <p>
                            <i className="bi bi-telephone me-2"></i>
                            {reservation.mobile_number}
                        </p>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-xl-4 d-flex flex-row align-items-end align-items-md-stretch mt-3 mt-md-0">
                    <button
                        type="button"
                        name="cancel"
                        className="btn btn-text cancel flex-grow-1 text-nowrap"
                        data-reservation-id-cancel={reservation.reservation_id}
                        onClick={() => cancelButtonHandler(reservation_id)}
                    >
                        Cancel
                    </button>
                    <Link
                        to={`/reservations/${reservation_id}/edit`}
                        className="d-flex flex-grow-1 px-1"
                    >
                        <button
                            type="button"
                            name="edit"
                            className="btn btn-outline-primary flex-grow-1"
                        >
                            Edit
                        </button>
                    </Link>
                    {hasTables && (
                        <Link
                            to={`/reservations/${reservation_id}/seat`}
                            className="d-flex flex-grow-1 ps-1"
                        >
                            <button
                                type="button"
                                name="seat"
                                className="btn btn-primary flex-grow-1"
                            >
                                Seat
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        );
    }
    return (
        <div className="card d-flex flex-row flex-wrap justify-content-between p-3 p-md-4 mb-1">
            <div className="col-12 col-xl-8 d-flex flex-row flex-wrap">
                <div className="d-flex align-items-xl-center col-5 col-sm-4 col-md-2 col-xl-2 pb-2 p-xl-0">
                    <p className="p-bold">
                        <i className="bi bi-clock me-2"></i>
                        {formatTime(reservation.reservation_time)}
                    </p>
                </div>
                <div className="d-flex align-items-xl-center col-7 col-sm-8 col-md-4 col-xl-4">
                    <p>
                        <i className="bi bi-person me-2"></i>
                        {reservation.first_name} {reservation.last_name} (
                        {reservation.people})
                    </p>
                </div>
                <div className="d-flex align-items-xl-center col-5 col-sm-4 col-md-3 col-xl-3 order-md-4 order-xl-3">
                    <p data-reservation-id-status={reservation_id}>
                        <i className="bi bi-clipboard-check me-2"></i>
                        {reservation.status[0].toUpperCase() +
                            reservation.status.substring(1)}
                    </p>
                </div>
                <div className="d-flex align-items-xl-center col-7 col-sm-8 col-md-3 col-xl-3">
                    <p>
                        <i className="bi bi-telephone me-2"></i>
                        {reservation.mobile_number}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReservationsListItem;