import React from "react";

/**
 * Defines a reservation returned from the database
 * @param table
 * A table object
 * @param finishButtonHandler
 * Click handler function for finish button
 * @returns {JSX.Element}
 */
const TablesListItem = ({ table, finishButtonHandler }) => {
    // Displays table card as filled when reservation is seated
    const tableFilled = () => {
        const tableBaseStyle = `card table-card align-self-stretch flex-fill d-flex flex-column p-3`;
        return table.reservation_id
            ? `table-filled ${tableBaseStyle}`
            : tableBaseStyle;
    };

    return (
        <div className={tableFilled()}>
            <div className="d-flex flex-row justify-content-between">
                <div>
                    <h3 className="mb-3">{table.table_name}</h3>
                    <p>
                        <i className="bi bi-people me-2"></i>
                        {table.capacity}
                    </p>
                </div>
                <p data-table-id-status={table.table_id}>
                    {table.reservation_id ? "OCCUPIED" : "FREE"}
                </p>
            </div>

            <button
                data-table-id-finish={table.table_id}
                type="button"
                className="btn btn-outline-primary mt-3"
                onClick={() => finishButtonHandler(table.table_id)}
                hidden={!table.reservation_id}
            >
                <i className="bi bi-check2-circle me-2"></i>Finish
            </button>
        </div>
    );
};

export default TablesListItem;