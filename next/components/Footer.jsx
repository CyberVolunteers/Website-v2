import React from 'react'
import Link from 'next/link'

import styles from "../styles/footer.module.css"

function Footer() {
    return (
        <div className={`${styles["Footer"]} w-1000`}>
            <div className={`${styles["top-area"]}`}>
                <ul>
                    <li className={`${styles["heading"]}`}>
                        Volunteer
                    </li>
                    <li>
                        <Link href="/">
                            Volunteer now
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={`${styles["heading"]}`}>
                        More about us
                    </li>
                    <li>
                        <Link href="/">

                            About us

                        </Link>
                    </li>
                    <li>
                        <Link href="/">

                            Contact us

                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={`${styles["heading"]}`}>
                        Account management
                    </li>
                    <li>
                        <Link href="/">
                            Sign in
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            Sign up
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            My account
                        </Link>
                    </li>
                    <li>
                        <Link href="/">
                            Log out
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={`${styles["heading"]}`}>
                        Explore
                    </li>
                    <li>
                        <Link href="/">
                            Search listings
                        </Link>
                    </li>
                </ul>
            </div>

            <p className={`${styles["copy-right"]}`}>
                © {new Date().getFullYear()} Cybervolunteers. All rights reserved.
            </p>
        </div>
    )
}

export default Footer
