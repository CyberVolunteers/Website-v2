import React, { useState } from 'react'
import Link from 'next/link'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';

import { useWindowSize } from '../lib/client/hooks';

import styles from "../styles/header.module.css"

function Header() {
    const sidebarLimitWidth = 600;
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [isSidebarUp, setisSidebarUp] = useState(false);

    const windowSize = useWindowSize();

    const signUpOrMyAccountEl = isLoggedIn ?
        <li>
            <Link href="/">My Account</Link>
        </li>
        :
        <>
            <li>
                <Link href="/">Sign in</Link>
            </li>
            {
                windowSize.width > sidebarLimitWidth || windowSize.width === undefined ? // only show it on the larger screens (the button on the bottom will be showed otherwise)
                    <li>
                        <Link href="/">Sign up</Link>
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
                            <Link href="/">Volunteer</Link>
                        </li>

                        <li>
                            <Link href="/">
                                About Us
                            </Link>

                        </li>
                        <li>
                            <Link href="/">
                                Contact us
                            </Link>
                        </li>

                    </aside>
                    : null
            }

            <header className={`${styles["Header"]}`}>
                <div className={`${styles["header-content"]} w-1000 dflex-align-center`}>
                    <Link href="/">
                        <img className="pointer" src="/img/logo.svg" alt="" />
                    </Link>


                    <ul className="dflex-align-center">
                        <li className={`${styles["head"]} dflex-align-center`}>
                            <p>Volunteer</p>
                        </li>
                    </ul>

                    <form action="">
                        <div className={`${styles["input-wrapper"]} dflex-align-center`}>
                            <SearchIcon />
                            <input type="text" placeholder="Search Here..." />
                        </div>
                    </form>

                    <ul className="dflex-align-center">
                        {/* <li>
                            <Link href="/">
                                Volunteer now
                            </Link>
                        </li> */}
                        <li className={`${styles["drop-down"]} ${styles["dropdown-wrapper"]} ${styles["about-wrapper"]}`}>
                            <div className={`${styles["head"]} dflex-align-center`}>
                                <p>About</p>
                                <ArrowDropDownIcon />
                            </div>
                            <ul className={`${styles["body"]}`}>
                                <li>
                                    <Link href="/">
                                        About Us
                                    </Link>

                                </li>
                                <li>
                                    <Link href="/">
                                        Contact us
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        {signUpOrMyAccountEl}
                        {
                            windowSize.width <= sidebarLimitWidth ?
                                <li className={`${styles["bottomButton"]}`}>
                                    <Link href="/">Sign in</Link>
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
