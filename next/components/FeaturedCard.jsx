import React from 'react'

import styles from "../styles/featuredCard.module.css"

function FeaturedCard({ img, title, subtitle, desc, meternow, totalgo }) {
    return (
        <div className={`${styles["FeaturedCard"]} w-1000`}>
            {/* <img src="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/462293fd2c362d08699976464e326bf2.jpg" alt="" /> */}
            <img src={img} alt="" />

            <div className={`${styles["presentation"]}`}>
                <h3>{title}</h3>
                <h4>{subtitle}</h4>

                <p className={`${styles["description"]}`}>
                    {desc}

                    <a href="#" >Read more</a>
                </p>

                <div className={`${styles["meter-total"]}`}>
                    <div className={`${styles["meter"]}`}></div>
                </div>

                <span className={`${styles["total-go"]}`}>
                    {totalgo}$ to go
                </span>

                <button className={`${styles["volunteer-now"]}`}>
                    Volunteer Now
                </button>

            </div>
        </div>
    )
}

export default FeaturedCard
