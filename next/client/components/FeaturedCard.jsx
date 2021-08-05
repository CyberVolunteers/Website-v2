import Link from 'next/link';
import React from 'react'

import styles from "../styles/featuredCard.module.css"

function FeaturedCard({ img, listing }) {

    const { title, organisationName, desc, currentVolunteers, requestedVolunteers, uuid } = listing;
    return (
        <div className={`${styles["FeaturedCard"]} w-1000`}>
            <img src={img} alt="" />

            <div className={`${styles["presentation"]}`}>
                <h3 className={`${styles["title"]}`}>{title}</h3>
                <h4 className={`${styles["organisationName"]}`}>{organisationName}</h4>

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

                <Link href={`/listing?uuid=${uuid}`} passHref>
                    <a className={`${styles["volunteer-now"]}`}>
                        <p>
                            Volunteer Now
                        </p>
                    </a>
                </Link>

            </div>
        </div>
    )
}

export default FeaturedCard
