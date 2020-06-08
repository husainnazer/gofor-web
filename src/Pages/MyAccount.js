import React, { Component } from "react";
import Photo from "../iphone.jpg";

class MyAccount extends Component {
    render() {
        return (
            <>
                <div className="image-onPage-div">
                    <img
                        alt="newone"
                        onClick={this.runthis}
                        className="image-onPage"
                        src={Photo}
                    />
                </div>
                <div className="product-title-new">
                    <h1>iPhone SE</h1>
                </div>
            </>
        );
    }
}
export default MyAccount;
