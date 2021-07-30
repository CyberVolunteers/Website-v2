import React from 'react'

import styles from "../styles/featuredCard.module.css"

function FeaturedCard({ img, listing }) {

    const { title, charityName, desc, currentVolunteers, requestedVolunteers } = listing;
    return (
        <div className={`${styles["FeaturedCard"]} w-1000`}>
            {/* <img src="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/462293fd2c362d08699976464e326bf2.jpg" alt="" /> */}
            <img src={img} alt="" />

            <div className={`${styles["presentation"]}`}>
                <h3 className={`${styles["title"]}`}>{title}</h3>
                <h4 className={`${styles["charityName"]}`}>{charityName}</h4>

                <p className={`${styles["description"]}`}>
                    {desc}

                    <a href="#" >Read more</a>
                </p>

                <div className={`${styles["meter-total"]}`}>
                    <div className={`${styles["meter"]}`} style={{
                        width: (currentVolunteers / requestedVolunteers) * 100 + "%"
                    }}></div>
                </div>

                <span className={`${styles["volunteers-progress-bar"]}`}>
                    {currentVolunteers}/{requestedVolunteers} volunteers
                </span>

                <button className={`${styles["volunteer-now"]} w-100`}>
                    Volunteer Now
                </button>

            </div>
        </div>
    )
}

export default FeaturedCard
