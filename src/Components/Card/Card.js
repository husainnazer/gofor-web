import React, { Component } from "react";
import "./Card.css";

class Card extends Component {
    formatNumber = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    render() {
        const { imageUrl, price } = this.props;
        return (
            <>
                <div className="wrapper">
                    <div className="card">
                        <img alt="productimage" src={imageUrl} />
                        <div className="info">
                            <p>₹ {this.formatNumber(price)}</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Card;
