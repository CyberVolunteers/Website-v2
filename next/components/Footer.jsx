import React from 'react'
import Link from 'next/link'

import styles from "../styles/footer.module.css"

function Footer() {
    return (
        <div className={`${styles["Footer"]} w-1000`}>
            <div className={`${styles["top-area"]}`}>
                <ul>
                    <li className={`${styles["heading"]}`}>
                        Borrow
                    </li>
                    <li>
                        Loans for entrepreneurs doing amazing things.
                    </li>
                    <li>
                        <Link href="/">
                            Apply now
                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={`${styles["heading"]}`}>
                        Get to know us
                    </li>
                    <li>
                        <Link href="/">

                            About us

                        </Link>
                    </li>
                    {/* <li>
                        <Link>

                            How Kiva works
                        </Link>
                    </li>
                    <li>
                        <Link>

                            FAQs


                        </Link>
                    </li>
                    <li>
                        <Link>

                            Where Kiva works



                        </Link>
                    </li>
                    <li>
                        <Link>

                            Blog

                        </Link>
                    </li>
                    <li>
                        <Link>

                            Partner with us



                        </Link>
                    </li>
                    <li>
                        <Link>

                            Contact us


                        </Link>
                    </li>
                    <li>
                        <Link>

                            Help


                        </Link>
                    </li> */}
                </ul>

                <ul>
                    <li className={`${styles["heading"]}`}>
                        Lend

                    </li>
                    <li>
                        Make a loan, change a life.
                    </li>

                    <li>
                        <Link href="/">
                            Lend now


                        </Link>

                    </li>
                    <li>
                        <Link href="/">
                            Monthly Good


                        </Link>

                    </li>
                </ul>

                <ul>
                    <li className={`${styles["heading"]}`}>
                        Explore

                    </li>

                    <li>
                        <Link href="/">
                            Protocol


                        </Link>

                    </li>
                    <li>
                        <Link href="/">
                            Gifts




                        </Link>

                    </li>
                    <li>
                        <Link href="/">
                            Happening now




                        </Link>

                    </li>
                    <li>
                        <Link href="/">
                            Developer API





                        </Link>

                    </li>
                </ul>

                {/* 
                <ul>
                    <li className={`${styles["heading"]}`}>
                        Community
                    </li>
                    <li>
                        <Link>
                            Teams

                        </Link>
                    </li>
                    <li>
                        <Link>
                            Students and educators

                        </Link>
                    </li>
                </ul>

                <ul>
                    <li className={`${styles["heading"]}`}>
                        Company
                    </li>

                    <li>
                        <Link>
                            Privacy policy
                        </Link>
                    </li>
                    <li>
                        <Link>
                            Cookie and Data Settings

                        </Link>
                    </li>
                    <li>
                        <Link>
                            Terms of use

                        </Link>
                    </li>
                    <li>
                        <Link>
                            Site map

                        </Link>
                    </li>
                </ul> */}

            </div>


            <p>
                Lending through Kiva involves risk of principal loss. Kiva does not guarantee repayment or offer a financial return on your loan.
            </p>

            <p className={`${styles["copy-right"]}`}>
                © 2021 Kiva. All rights reserved.
            </p>
        </div>
    )
}

export default Footer
