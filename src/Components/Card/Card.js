import React, { Component } from "react";
import "./Card.css";

class Card extends Component {
    formatNumber = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    render() {
        const { imageUrl, price, title } = this.props;
        return (
            <>
                <div className="wrapper">
                    <div className="card">
                        <img alt="productimage" src={imageUrl} />
                        <p className="info-price">
                            ₹ {this.formatNumber(price)}
                        </p>
                        <p className="info-title">{title}</p>
                    </div>
                </div>
            </>
        );
    }
}

export default Card;
