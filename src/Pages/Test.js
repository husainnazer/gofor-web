import React, { useState, useEffect } from "react";
import cities from "../allCities";

const Test = () => {
    const [searchValue, setSearchValue] = useState("");
    const [distVal, setDistVal] = useState("");
    let filteredCities;
    if (distVal !== "") {
        filteredCities = cities.Kerala[distVal].filter((city) => {
            return city.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
        });
    }

    useEffect(() => {
        console.log(distVal);
    }, [distVal]);

    return (
        <>
            {Object.entries(cities.Kerala).map(([key, value]) => (
                <h1 onClick={() => setDistVal(key)}>{key}</h1>
            ))}
            <input
                // onClick={() => {
                //     for (let [key] of Object.entries(cities.Kerala)) {
                //         console.log(key);
                //     }
                //     Object.entries(cities.Kerala).map((key) =>
                //         console.log(key)
                //     );
                // }}
                onChange={(event) => setSearchValue(event.target.value)}
            />
            {distVal !== "" ? (
                filteredCities
                    .slice(0, 5)
                    .map((data) => (
                        <h1
                            style={
                                searchValue === ""
                                    ? { opacity: 0 }
                                    : { opacity: 1 }
                            }
                        >
                            {data}
                        </h1>
                    ))
            ) : (
                <h1>Why?</h1>
            )}
            {/* {filteredCities.slice(0, 5).map((data) => (
                <h1
                    style={searchValue === "" ? { opacity: 0 } : { opacity: 1 }}
                >
                    {data}
                </h1>
            ))} */}
        </>
    );
};

export default Test;
