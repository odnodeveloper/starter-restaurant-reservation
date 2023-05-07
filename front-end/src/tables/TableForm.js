import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the form for creating a table
 * @param table
 * A table object
 * @param error
 * Error object returned from the server if there is one
 * @param handleTableNameChange
 * Change handler function for `table name` input fields
 * @param handlePeopleNumberChange
 * Change handler function for `capacity` numeric input to set lower limit of 1
 * @param handleSubmit
 * Click handler function to submit infomation from form
 * @returns {JSX.Element}
 */
const TableForm = ({
    table,
    error,
    handleTableNameChange,
    handleCapacityChange,
    handleSubmit,
}) => {
    const history = useHistory();

    const handleEnter = event => {
        if (event.key.toLowerCase() === "enter") {
            event.preventDefault();
        }
    };

    const handleCancel = () => {
        history.goBack();
    };

    return (
        <div>
            <ErrorAlert error={error} />
            <div className="form-container p-4 p-md-5">
                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <label htmlFor="table_name" className="form-label">
                            Table name
                        </label>
                        <input
                            type="text"
                            name="table_name"
                            className="form-control"
                            id="table_name"
                            autoComplete={"off"}
                            placeholder={"Table Name"}
                            value={table.table_name}
                            onChange={handleTableNameChange}
                            onKeyDown={handleEnter}
                            required
                        />
                    </div>

                    <div className="form-floating mb-3">
                        <label htmlFor="capacity" className="form-label">
                            Capacity
                        </label>
                        <input
                            type="number"
                            name="capacity"
                            className="form-control"
                            id="capacity"
                            placeholder="1"
                            value={table.capacity}
                            onChange={handleCapacityChange}
                            onKeyDown={handleEnter}
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="col-6 col-md-2 d-flex pe-1">
                            <button
                                className="btn btn-secondary flex-fill"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="col-6 col-md-2 d-flex ps-1">
                            <button className="btn btn-primary flex-fill" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TableForm;