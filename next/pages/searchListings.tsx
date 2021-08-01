import React, { useState } from 'react'
import Card from '../components/Card'
import FeaturedCard from '../components/FeaturedCard'
import Pagination from '@material-ui/lab/Pagination';
import Footer from '../components/Footer'
import Link from 'next/link'

import styles from '../styles/searchListings.module.css'

export default function SearchListings() {
    const listingsPerPage = 6;

    const listings = [];

    for (let i = 0; i < 7; i++) {
        listings.push({
            uuid: "abcd-uuid-asafs",
            title: `<title> ${i}`,
            desc: "<desc>",
            organisationName: "<org name>",
            currentVolunteers: 4,
            requestedVolunteers: 10,
        })
    }

    const pagesNum = Math.ceil(listings.length / listingsPerPage);
    const [listingsPage, setListingsPage] = useState(0)

    return (
        <div className={`${styles["Home"]}`}>

            <div className={`${styles["top-area"]} dflex w-1000`}>
                <span className="w-100 dflex-align-center">
                    <h1>Volunteer now</h1>
                    <span className={`${styles["right-side"]}`}>
                        <img className={`${styles["icon"]}`} src="/img/filter.svg" />
                        <p>Filter</p>
                    </span>
                </span>
            </div >


            <div className={`${styles["featured-card-wrapper"]}`}>
                <h1 className="w-1000">Featured: Loans with research backed impact</h1>
                <p className="w-1000">{listings[0].title}</p>
                <FeaturedCard listing={listings[0]} img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/462293fd2c362d08699976464e326bf2.jpg" />
            </div>


            <div className={`${styles["cards-grid"]} w-1000`}>

                {
                    listings.filter((val, index) => index >= listingsPage * listingsPerPage && index < (listingsPage + 1 * listingsPerPage)).map((value, index) => <Card key={index} img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/4cef12842110eabb16e7f2d27acabe5b.jpg" listing={value} />)
                }
            </div>


            <div className={`${styles["pagination-area"]} w-1000`}>
                <div className={`${styles["pages"]}`}>
                    {/* because they start with 1 for some reason */}
                    <Pagination count={pagesNum} page={listingsPage + 1} onChange={(event, value) => setListingsPage(value - 1)} />
                </div>
            </div>
        </div >
    )
}
