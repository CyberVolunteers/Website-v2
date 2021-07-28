import React from 'react'
import Header from '../components/Header'
import Card from '../components/Card'
import FeaturedCard from '../components/FeaturedCard'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Footer from '../components/Footer'
import Link from 'next/link'
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';

import styles from '../styles/searchListings.module.css'

function Home() {
    return (
        <div className={`${styles["Home"]}`}>
            <Header />

            <div className={`${styles["top-area"]} dflex w-1000`}>
                <div className={`${styles["left-side"]}`}>
                    <small><span>All Loans</span>  Eco-friendly</small>
                    <h1>Eco-friendly</h1>
                    <p>Protecting the environment and creating economic growth don’t always go hand in hand, but by supporting these loans you give people access to products that reduce pollution and provide sustainable energy, and support businesses that promote recycling.</p>
                </div>
                <div className={`${styles["right-side"]} dflex-align-center`}>
                    <Link className={`${styles["explore"]} dflex-align-center`} href="/">
                        <>
                            <ExploreOutlinedIcon />
                            <p>Explore</p>
                        </>
                    </Link>

                    <Link className=" dflex-align-center" href="/">
                        <>
                            {/* <img src={Filter} /> */}
                            <p>Filter</p>
                        </>
                    </Link>
                </div>
            </div>


            <div className={`${styles["featured-card-wrapper"]}`}>
                <h1 className="w-1000">Featured: Loans with research backed impact</h1>
                <p className="w-1000">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla ipsa sint numquam adipisci perferendis cupiditate dicta libero rem totam commodi!</p>
                <FeaturedCard img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/462293fd2c362d08699976464e326bf2.jpg" title="Kalimurhima Group
" subtitle="Congo (DRC)" desc="A loan of $7,700 helps a member who is going to stock up with bundles of used clothing, which will build up her working capital." meternow="10" totalgo="680" />
            </div>



            <div className={`${styles["cards-grid"]} w-1000`}>

                <Card img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/4cef12842110eabb16e7f2d27acabe5b.jpg" title="Miguel Antonio" subtitle="Colombia" desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine." meternow="20" totalgo="120" />
                <Card img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/462293fd2c362d08699976464e326bf2.jpg" title="Kalimurhima Group
" subtitle="Congo (DRC)" desc="A loan of $7,700 helps a member who is going to stock up with bundles of used clothing, which will build up her working capital." meternow="10" totalgo="680" />
                <Card img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/c767c66b71dccf345147220dc67cf491.jpg" title="Analyn" subtitle="Philippines" desc="A loan of $150 helps to build a sanitary toilet for her family" meternow="25" totalgo="50" />

                <Card img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/4cef12842110eabb16e7f2d27acabe5b.jpg" title="Miguel Antonio" subtitle="Colombia" desc="A loan of $525 helps to improve his tomato greenhouse and acquire an irrigation machine." meternow="20" totalgo="120" />
                <Card img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/462293fd2c362d08699976464e326bf2.jpg" title="Kalimurhima Group
" subtitle="Congo (DRC)" desc="A loan of $7,700 helps a member who is going to stock up with bundles of used clothing, which will build up her working capital." meternow="10" totalgo="680" />
                <Card img="https://www-kiva-org-0.freetls.fastly.net/img/w480h360/c767c66b71dccf345147220dc67cf491.jpg" title="Analyn" subtitle="Philippines" desc="A loan of $150 helps to build a sanitary toilet for her family" meternow="25" totalgo="50" />
            </div>


            <div className={`${styles["pagination-area"]} w-1000`}>
                <div className={`${styles["left-arrow"]} ${styles["arrow"]}`}>
                    <ArrowLeftIcon />
                </div>

                <div className={`${styles["pages"]}`}>
                    {/* <span className={`${styles["select"]}`}>
                        <Link>
                            1
                        </Link>
                    </span>
                    <span>
                        <Link>
                            2
                        </Link>
                    </span>
                    <span>
                        <Link>
                            3
                        </Link>
                    </span>

                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                    <span>
                        <Link>
                            44
                        </Link>
                    </span> */}
                </div>
                <div className={`${styles["right-arrow"]} ${styles["arrow"]}`}>
                    <ArrowRightIcon />
                </div>

            </div>

            <Footer />
        </div>
    )





}

export default Home
