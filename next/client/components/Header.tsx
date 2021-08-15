import React, { useState } from 'react'
import Link from 'next/link'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';

import { useWindowSize } from '../utils/otherHooks';
import { useViewerType } from "../utils/userState";

import styles from "../styles/header.module.css"
import { useIsAfterRehydration } from '../utils/otherHooks';
import { ViewerType } from '../types';
import { useRouter } from 'next/dist/client/router';

function Header() {
    const sidebarLimitWidth = 600;
    const isAfterRehydration = useIsAfterRehydration();

    const router = useRouter();

    const userType = useViewerType();
    const isLoggedIn = (["user", "org", "unverified_user", "unverified_org"] as ViewerType[]).includes(userType);

    const [isSidebarUp, setIsSidebarUp] = useState(false);
    const [searchKeywords, setSearchKeywords] = useState("");

    const onSearch: React.FormEventHandler<HTMLFormElement> = (evt) => {
        evt.preventDefault()
        router.push(`/searchListings?${new URLSearchParams({
            keywords: searchKeywords
        })}`)
    }

    const windowSize = useWindowSize();

    const windowWidth = windowSize.width ?? 1000; // to make sure that the larger version is displayed otherwise

    const actionSlot = !isAfterRehydration ? null : ["org", "unverified_org"].includes(userType) ?
        <Link href="/manageListings" passHref>
            <a>
                <p>
                    Manage listings
                </p>
            </a>
        </Link>
        :
        <Link href="/searchListings" passHref>
            <a>
                <p>
                    Volunteer
                </p>
            </a>
        </Link>

    const signUpOrMyAccountEl = !isAfterRehydration ? null : isLoggedIn ?
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
                !isAfterRehydration || windowWidth > sidebarLimitWidth ? // only show it on the larger screens (the button on the bottom will be showed otherwise)
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
                isAfterRehydration && isSidebarUp && windowWidth <= sidebarLimitWidth ?

                    <aside className={`${styles["sidebar"]}`}>

                        {signUpOrMyAccountEl}


                        <li>
                            {actionSlot}
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
                            <img className="pointer" src="/img/logo.svg" alt="Our logo" />
                        </a>
                    </Link>


                    <ul className="dflex-align-center">
                        <li className={`${styles["head"]} dflex-align-center`}>
                            {actionSlot}
                        </li>
                    </ul>

                    {
                        isAfterRehydration ? // because it resizes automatically, we need to disable it to prevent flicker
                            <form onSubmit={onSearch}>
                                <div className={`${styles["input-wrapper"]} dflex-align-center`}>
                                    <SearchIcon />
                                    <input type="text" placeholder="Search Here..." value={searchKeywords} onChange={v => setSearchKeywords(v.currentTarget.value)} />
                                </div>
                            </form>
                            : null
                    }

                    <ul className="dflex-align-center">
                        <li className={`${styles["drop-down"]} ${styles["dropdown-wrapper"]} ${styles["about-wrapper"]}`}>
                            {
                                isAfterRehydration ? // because it resizes automatically, we need to disable it to prevent flicker
                                    <div className={`${styles["head"]} dflex-align-center`}>
                                        <p>About</p>
                                        <ArrowDropDownIcon />
                                    </div>
                                    : null
                            }
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
                            isAfterRehydration && windowWidth <= sidebarLimitWidth ?
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

                    <div className={`${styles["burger-icon"]}`} onClick={e => setIsSidebarUp(!isSidebarUp)}>
                        <MenuIcon />
                    </div>
                </div>
            </header>
        </>
    )

}

export default Header
