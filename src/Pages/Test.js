import React, { useState } from "react";
import cities from "../allCities";

const Test = () => {
    const [searchValue, setSearchValue] = useState("");
    const [distVal, setDistVal] = useState("");
    let filteredCities;
    if (distVal !== "") {
        filteredCities = cities.kerala[distVal].filter((city) => {
            return city.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
        });
    }

    return (
        <>
            <div className="main-container-test">
                <div className="state-section-test">
                    <div className="state-select-container-test">
                        <div
                            style={
                                distVal === "alappuzha"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("alappuzha")}
                        >
                            Alappuzha
                        </div>
                        <div
                            style={
                                distVal === "ernakulam"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("ernakulam")}
                        >
                            Ernakulam
                        </div>
                        <div
                            style={
                                distVal === "idukki"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("idukki")}
                        >
                            Idukki
                        </div>
                        <div
                            style={
                                distVal === "kannur"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("kannur")}
                        >
                            Kannur
                        </div>
                        <div
                            style={
                                distVal === "kasaragod"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("kasaragod")}
                        >
                            Kasaragod
                        </div>
                        <div
                            style={
                                distVal === "kollam"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("kollam")}
                        >
                            Kollam
                        </div>
                        <div
                            style={
                                distVal === "kottayam"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("kottayam")}
                        >
                            Kottayam
                        </div>
                        <div
                            style={
                                distVal === "kozhikode"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("kozhikode")}
                        >
                            Kozhikode
                        </div>
                        <div
                            style={
                                distVal === "malappuram"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("malappuram")}
                        >
                            Malappuram
                        </div>
                        <div
                            style={
                                distVal === "palakkad"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("palakkad")}
                        >
                            Palakkad
                        </div>
                        <div
                            style={
                                distVal === "pathanamthitta"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("pathanamthitta")}
                        >
                            Pathanamthitta
                        </div>
                        <div
                            style={
                                distVal === "thiruvananthapuram"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("thiruvananthapuram")}
                        >
                            Thiruvananthapuram
                        </div>
                        <div
                            style={
                                distVal === "thrissur"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("thrissur")}
                        >
                            Thrissur
                        </div>
                        <div
                            style={
                                distVal === "wayanad"
                                    ? {
                                          backgroundColor: "rgb(80, 80, 80)",
                                          color: "rgb(200, 200, 200)",
                                      }
                                    : null
                            }
                            onClick={() => setDistVal("wayanad")}
                        >
                            Wayanad
                        </div>
                    </div>
                </div>

                <div className="city-section-test">
                    <div className="search-input-form-test">
                        <input
                            placeholder="Search location"
                            className="search-input-form-input-test"
                            onChange={(event) =>
                                setSearchValue(event.target.value)
                            }
                            id="search-id-test"
                        />
                    </div>
                    <div className="search-results-div-test">
                        {distVal !== "" ? (
                            filteredCities.length !== 0 ? (
                                filteredCities.map((data) => (
                                    <p className="search-results-content-test">
                                        {data}
                                    </p>
                                ))
                            ) : (
                                <p className="hint">No search results</p>
                            )
                        ) : (
                            <div className="hint">
                                <p>Select any</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Test;
