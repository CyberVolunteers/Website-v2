import React, { useState } from 'react'
import Link from 'next/link'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';

import { useWindowSize } from '../lib/client/hooks';

import styles from "../styles/header.module.css"
import { isLoggedIn as checkIfIsLoggedIn } from '../lib/client/util';
import { useEffect } from 'react';

function Header() {
    const sidebarLimitWidth = 600;
    const [isLoggedIn, setIsLoggedIn] = useState(false); // start off false (default on the server) and then change if needed
    useEffect(() => setIsLoggedIn(checkIfIsLoggedIn()), []); // change on any rerender

    const [isSidebarUp, setisSidebarUp] = useState(false);

    const windowSize = useWindowSize();

    const signUpOrMyAccountEl = isLoggedIn ?
        <li>
            <Link href="/myAccount" passHref>
                <a>
                    <p>
                        My Account
                    </p>
                </a>
            </Link>
        </li>
        :
        <>
            <li>
                <Link href="/login" passHref>
                    <a>
                        <p>
                            Sign in
                        </p>
                    </a>
                </Link>
            </li>
            {
                windowSize.width > sidebarLimitWidth || windowSize.width === undefined ? // only show it on the larger screens (the button on the bottom will be showed otherwise)
                    <li>
                        <Link href="/signupSelect" passHref>
                            <a>
                                <p>
                                    Sign up
                                </p>
                            </a>
                        </Link>
                    </li>
                    : null
            }
        </>


    return (

        <>

            {
                isSidebarUp && windowSize.width <= sidebarLimitWidth ?

                    <aside className={`${styles["sidebar"]}`}>

                        {signUpOrMyAccountEl}


                        <li>
                            <Link href="/searchListings" passHref>
                                <a>
                                    <p>
                                        Volunteer
                                    </p>
                                </a>
                            </Link>
                        </li>

                        <li>
                            <Link href="/aboutUs" passHref>
                                <a>
                                    <p>
                                        About Us
                                    </p>
                                </a>
                            </Link>

                        </li>
                        <li>
                            <Link href="/contactUs" passHref>
                                <a>
                                    <p>
                                        Contact us
                                    </p>
                                </a>
                            </Link>
                        </li>

                    </aside>
                    : null
            }

            <header className={`${styles["Header"]}`}>
                <div className={`${styles["header-content"]} w-1000 dflex-align-center`}>
                    <Link href="/" passHref>
                        <a>
                            <img className="pointer" src="/img/logo.svg" alt="" />
                        </a>
                    </Link>


                    <ul className="dflex-align-center">
                        <li className={`${styles["head"]} dflex-align-center`}>
                            <Link href="/searchListings" passHref>
                                <a>
                                    <p>
                                        Volunteer
                                    </p>
                                </a>
                            </Link>
                        </li>
                    </ul>

                    <form action="">
                        <div className={`${styles["input-wrapper"]} dflex-align-center`}>
                            <SearchIcon />
                            <input type="text" placeholder="Search Here..." />
                        </div>
                    </form>

                    <ul className="dflex-align-center">
                        <li className={`${styles["drop-down"]} ${styles["dropdown-wrapper"]} ${styles["about-wrapper"]}`}>
                            <div className={`${styles["head"]} dflex-align-center`}>
                                <p>About</p>
                                <ArrowDropDownIcon />
                            </div>
                            <ul className={`${styles["body"]}`}>
                                <li>
                                    <Link href="/aboutUs" passHref>
                                        <a>
                                            <p>
                                                About Us
                                            </p>
                                        </a>
                                    </Link>

                                </li>
                                <li>
                                    <Link href="/contactUs" passHref>
                                        <a>
                                            <p>
                                                Contact us
                                            </p>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        {signUpOrMyAccountEl}
                        {
                            windowSize.width <= sidebarLimitWidth ?
                                <li className={`${styles["bottomButton"]}`}>
                                    <Link href="/login" passHref>
                                        <a>
                                            <p>
                                                Sign in
                                            </p>
                                        </a>
                                    </Link>
                                </li>
                                : null
                        }
                    </ul>

                    <div className={`${styles["burger-icon"]}`} onClick={e => setisSidebarUp(!isSidebarUp)}>
                        <MenuIcon />
                    </div>
                </div>
            </header>
        </>
    )

}

export default Header
