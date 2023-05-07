import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

const EditReservation = () => {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
        status: "",
    });

    const [reservationLoaded, setReservationLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(loadReservation, [reservation_id]);

    function formatDateAndTime(reservation) {
        return {
            ...reservation,
            reservation_time: `${reservation.reservation_time.split(":")[0]}:${reservation.reservation_time.split(":")[1]
                }`,
            reservation_date: reservation.reservation_date.split("T")[0],
        };
    }

    function loadReservation() {
        const abortController = new AbortController();
        setError(null);
        getReservation(reservation_id, abortController.signal)
            .then(foundReservation => {
                setReservationLoaded(true);
                const formatted = formatDateAndTime(foundReservation);
                setReservation(formatted);
            })
            .catch(setError);
        return () => abortController.abort();
    }

    const handleChange = event => {
        setReservation({
            ...reservation,
            [event.target.name]: event.target.value,
        });
    };

    const handlePeopleNumberChange = event => {
        setReservation({
            ...reservation,
            people: Math.max(1, event.target.value),
        });
    };

    const handleSubmit = async event => {
        event.preventDefault();
        const abortController = new AbortController();
        try {
            await updateReservation(
                reservation_id,
                reservation,
                abortController.signal
            );
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        } catch (error) {
            setError(error);
        }
        return () => abortController.abort();
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className="col-12 col-lg-8">
                <h1 className="my-4">Edit Reservation</h1>
                {reservationLoaded && (
                    <ReservationForm
                        reservation={reservation}
                        error={error}
                        handleChange={handleChange}
                        handlePeopleNumberChange={handlePeopleNumberChange}
                        handleSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
};

export default EditReservation;