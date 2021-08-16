import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

import styles from "../styles/featuredCard.module.css"

function FeaturedCard({ imagePath: img, title, organisationName, desc, currentVolunteers, requestedVolunteers, uuid }) {
    console.log({ imagePath: img, title, organisationName, desc, currentVolunteers, requestedVolunteers, uuid })
    return (
        <div className={`${styles["FeaturedCard"]} w-1000`}>
            <div className={`img-container`}>
                <Image
                    src={img}
                    // width={100}
                    // height={100}
                    size={"40vw"}
                    layout="fill"
                    objectFit="contain"
                    alt="Featured listing image"
                />
            </div>

            <div className={`${styles["presentation"]}`}>
                <h3 className={`${styles["title"]}`}>{title}</h3>
                <h4 className={`${styles["organisationName"]}`}>{organisationName}</h4>

                <p className={`${styles["description"]}`}>
                    {desc}

                    <a href="#" >Read more</a>
                </p>

                <div className={`${styles["meter-total"]}`}>
                    <div className={`${styles["meter"]}`} style={{
                        width: (currentVolunteers / requestedVolunteers) * 100 + "%" //TODO: set this
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
