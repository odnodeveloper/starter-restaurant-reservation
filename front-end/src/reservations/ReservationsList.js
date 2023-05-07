import React from "react";
import ReservationsListItem from "./ReservationsListItem";

/**
 * Defines the list of reservations returned from the database
 * @param reservations
 * A possibly empty array of reservations
 * @param cancelButtonHandler
 * Click handler function for cancel button
 * @param reservationsLoading
 * Boolean to determine if loading indicator is shown
 * @param search
 * Boolean to determine how the list is displayed when used on search page
 * @param initialState
 * Boolean to determine if if initial state for search is active
 * @param hasTables
 * Boolean to determine if there are any tables to seat guests
 * @returns {JSX.Element}
 */
const ReservationsList = ({
    reservations,
    cancelButtonHandler,
    reservationsLoading,
    search = false,
    initialState = true,
    hasTables,
}) => {

    const displyReservationsList = () => {
        return reservations.length ? (
            reservations.map(reservation => {
                return (
                    <div key={reservation.reservation_id}>
                        <ReservationsListItem
                            reservation={reservation}
                            cancelButtonHandler={cancelButtonHandler}
                            hasTables={hasTables}
                        />
                    </div>
                );
            })
        ) : (
            <div className="card d-flex justify-content-center align-items-center p-4">
                <h3>No reservations found</h3>
            </div>
        );
    };

    const displySearchResults = () => {
        return initialState ? null : displyReservationsList();
    };

    if (search) {
        return (
            <div>
                <div className="row d-flex flex-column flex-sm-row flex-wrap mb-3">
                    <div className="col col-sm-7 d-md-flex flex-column align-items-start"></div>
                </div>
                <div>
                    {reservationsLoading ? null : displySearchResults()}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="row d-flex flex-column flex-sm-row flex-wrap mb-3">
                <div className="col col-sm-7 d-md-flex flex-column align-items-start"></div>
            </div>
            <div>
                {reservationsLoading ? null : displyReservationsList()}
            </div>
        </div>
    );
};

export default ReservationsList;