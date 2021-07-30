import React from 'react'

import styles from "../styles/card.module.css"

function Card({ img, listing }) {

    const { title, charityName, desc, currentVolunteers, requestedVolunteers } = listing;

    return (
        <div className={`${styles["Card"]}`}>
            <img src={img} />
            <div className={`${styles["bottom"]}`}>
                <h3 className={`${styles["title"]}`}>{title}</h3>
                <h4 className={`${styles["charityName"]}`}>{charityName}</h4>
                <p className={`${styles["description"]}`}>
                    {desc}

                    <a href="#" >Read more</a>
                </p>

                <div className={`${styles["meter-total"]}`}>
                    <div className={`${styles["meter"]}`} style={{ width: currentVolunteers / requestedVolunteers * 100 + "%" }}></div>
                </div>

                <span className={`${styles["volunteers-progress-bar"]}`}>
                    {currentVolunteers}/{requestedVolunteers} volunteers
                </span>

                <div className={`${styles["submittion-area"]} dflex-align-center`}>

                    <button className={`${styles["volunteer-now"]}`}>
                        Volunteer Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card
