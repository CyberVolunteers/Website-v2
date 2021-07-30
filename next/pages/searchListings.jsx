import React from 'react'
import Card from '../components/Card'
import FeaturedCard from '../components/FeaturedCard'
import Pagination from '@material-ui/lab/Pagination';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Footer from '../components/Footer'
import Link from 'next/link'

import styles from '../styles/searchListings.module.css'

function Home() {
    const listingsPerPage = 6;

    const listings = [
        {
            title: "<title>",
            desc: "<desc>",
            charityName: "<charity name>",
            currentVolunteers: 4,
            requestedVolunteers: 10
        },
        {
            title: "<title 2>",
            desc: "<desc 2>",
            charityName: "<charity name 2>",
            currentVolunteers: 44,
            requestedVolunteers: 100
        }
    ];

    const pagesNum = Math.ceil(listings.length / listingsPerPage);

    return (
        <div className={`${styles["Home"]}`}>

            <div className={`${styles["top-area"]} dflex w-1000`}>
                <span className="w-100 dflex-align-center">
                    <h1>Volunteer now</h1>
                    <Link href="/">
                        <span className={`${styles["right-side"]}`}>
                            <img className={`${styles["icon"]}`} src="/img/filter.svg" />
                            <p>Filter</p>
                        </span>
                    </Link>
                </span>
            </div >


            <div className={`${styles["featured-card-wrapper"]}`}>
                <h1 className="w-1000">Featured: Loans with research backed impact</h1>
                <p className="w-1000">{listings[0].title}</p>
                <FeaturedCard listing={listings[0]} img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/462293fd2c362d08699976464e326bf2.jpg" />
            </div>


            <div className={`${styles["cards-grid"]} w-1000`}>

                {
                    listings.map(value => <Card img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/4cef12842110eabb16e7f2d27acabe5b.jpg" listing={value} />)
                }
            </div>


            <div className={`${styles["pagination-area"]} w-1000`}>
                {/* <div className={`${styles["left-arrow"]} ${styles["arrow"]}`}>
                    <ArrowLeftIcon />
                </div> */}

                <div className={`${styles["pages"]}`}>
                    <Pagination count={10} />
                    {/* <span className={`${styles["select"]}`}>
                        <Link href="/">
                            1
                        </Link>
                    </span>
                    <span>
                        <Link href="/">
                            2
                        </Link>
                    </span>
                    <span>
                        <Link href="/">
                            3
                        </Link>
                    </span>

                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                    <span>
                        <Link href="/">
                            44
                        </Link>
                    </span> */}
                </div>
                {/* <div className={`${styles["right-arrow"]} ${styles["arrow"]}`}>
                    <ArrowRightIcon />
                </div> */}

            </div>

            <Footer />
        </div >
    )





}

export default Home
