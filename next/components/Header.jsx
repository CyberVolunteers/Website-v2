import React from 'react'
import Link from 'next/link'
import logo from '../public/img/logo.svg'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import SearchIcon from '@material-ui/icons/Search';
import MenuIcon from '@material-ui/icons/Menu';

import styles from "../styles/header.module.css"

function Header() {
    return (

        <>

            <aside className={`${styles["sidebar"]}`}>
                <li>
                    <Link href="/">
                        Find a cause
                    </Link>

                </li>
                {/* <li>
                    <Link>
                        Find a Borrower
                    </Link>

                </li>

                <li>
                    <Link>
                        About Us
                    </Link>

                </li>
                <li>
                    <Link>
                        How Works
                    </Link>
                </li>
                <li>
                    <Link>
                        Where Works
                    </Link>
                </li>
                <li>
                    <Link>
                        impact
                    </Link>
                </li>
                <li>
                    <Link>
                        Leadership
                    </Link>
                </li>
                <li>
                    <Link>
                        Financing
                    </Link>
                </li>
                <li>
                    <Link>
                        due diligence
                    </Link>
                </li> */}

            </aside>

            <header className={`${styles["Header"]}`}>
                <div className={`${styles["header-content"]} w-1000 dflex-align-center`}>
                    {/* <img src={logo} alt="" /> */}


                    <div className={`${styles["drop-down"]} ${styles["lend-wrapper"]}`}>
                        <div className={`${styles["head"]} dflex-align-center`}>
                            <p>Lend</p>
                            <ArrowDropDownIcon />
                        </div>
                        <ul className={`${styles["body"]}`}>
                            <li>
                                <Link href="/">
                                    Find a cause
                                </Link>

                            </li>
                            <li>
                                <Link href="/">
                                    Find a Borrower
                                </Link>

                            </li>
                        </ul>
                    </div>

                    <form action="">
                        <div className={`${styles["input-wrapper"]} dflex-align-center`}>
                            <SearchIcon />
                            <input type="text" placeholder="Search Here..." />
                        </div>
                    </form>

                    <ul className="dflex-align-center">
                        <li>
                            <Link href="/">
                                Borrow
                            </Link>
                        </li>
                        <li className={`${styles["drop-down"]} ${styles["lend-wrapper"]} ${styles["about-wrapper"]}`}>
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
                                        How Works
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/">
                                        Where Works
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link>
                                        impact
                                    </Link>
                                </li>
                                <li>
                                    <Link>
                                        Leadership
                                    </Link>
                                </li>
                                <li>
                                    <Link>
                                        Financing
                                    </Link>
                                </li>
                                <li>
                                    <Link>
                                        due diligence
                                    </Link>
                                </li> */}
                            </ul>
                        </li>

                        <li>
                            <Link href="/">Sign in</Link>
                        </li>
                    </ul>

                    <div className={`${styles["burger-icon"]}`} onClick={e => {
                        document.querySelector(".sidebar").classList.toggle("active")
                    }}>
                        <MenuIcon />
                    </div>
                </div>
            </header>
        </>
    )

}

export default Header
