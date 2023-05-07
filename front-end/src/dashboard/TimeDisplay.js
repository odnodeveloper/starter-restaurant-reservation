import React, { useEffect, useState } from "react";

const TimeDisplay = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);

        return () => clearInterval(timer);
    });

    return <p className="m-0">{time.toLocaleTimeString()}</p>;
};

export default TimeDisplay;