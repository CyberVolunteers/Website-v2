import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

import styles from "../styles/card.module.css"

function Card({ img, title, organisationName, desc, currentVolunteers, requestedVolunteers, uuid }) {

    return (
        <div className={`${styles["Card"]}`}>
            <div className={`${styles["card-image-container"]} img-container`}>
                <Image
                    src={img}
                    // width={100}
                    // height={100}
                    size={"30vw"}
                    layout="fill"
                    objectPosition="center top"
                    objectFit="contain"
                    alt="Listing image"
                />
            </div>
            <div className={`${styles["bottom"]}`}>
                <h3 className={`${styles["title"]}`}>{title}</h3>
                <h4 className={`${styles["organisationName"]}`}>{organisationName}</h4>
                <p className={`${styles["description"]}`}>
                    {desc}

                    <Link href={`/listing?uuid=${uuid}`} passHref>
                        <a>
                            Read more
                        </a>
                    </Link>
                </p>

                {/* <div className={`${styles["meter-total"]}`}>
                    <div className={`${styles["meter"]}`} style={{ width: currentVolunteers / requestedVolunteers * 100 + "%" }}></div>
                </div>

                <span className={`${styles["volunteers-progress-bar"]}`}>
                    {currentVolunteers}/{requestedVolunteers} volunteers
                </span> */}

                <div className={`${styles["submittion-area"]} dflex-align-center`}>

                    <Link href={`/listing?uuid=${uuid}`} passHref>
                        <a className={`${styles["volunteer-now"]}`}>
                            <p>
                                Volunteer Now
                            </p>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Card
