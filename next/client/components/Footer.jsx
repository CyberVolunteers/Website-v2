import React from "react";
import Link from "next/link";

import styles from "../styles/footer.module.css";

import { useRouter } from "next/dist/client/router";
import { pagesWithReducedHeaderAndFooter } from "../utils/const";

function Footer() {
	const router = useRouter();

	if (pagesWithReducedHeaderAndFooter.includes(router.pathname)) return <></>;
	return (
		<div className={`${styles["Footer"]} w-1000`}>
			<div className={`${styles["top-area"]}`}>
				<ul>
					<li className={`${styles["heading"]}`}>Volunteer</li>
					<li>
						<Link href="/searchListings" passHref>
							<a>
								<p>Volunteer now</p>
							</a>
						</Link>
					</li>
				</ul>

				<ul>
					<li className={`${styles["heading"]}`}>More about us</li>
					<li>
						<Link href="/aboutUs" passHref>
							<a>
								<p>About us</p>
							</a>
						</Link>
					</li>
					{/* <li>
						<Link href="/contactUs" passHref>
							<a>
								<p>Contact us</p>
							</a>
						</Link>
					</li> */}
				</ul>

				<ul>
					<li className={`${styles["heading"]}`}>Account management</li>
					<li>
						<Link href="/login" passHref>
							<a>
								<p>Sign in</p>
							</a>
						</Link>
					</li>
					<li>
						<Link href="/signupSelect" passHref>
							<a>
								<p>Sign up</p>
							</a>
						</Link>
					</li>
					{/* <li>
						<Link href="/myAccount" passHref>
							<a>
								<p>My account</p>
							</a>
						</Link>
					</li> */}
					<li>
						<Link href="/logout" passHref>
							<a>
								<p>Log out</p>
							</a>
						</Link>
					</li>
				</ul>

				<ul>
					<li className={`${styles["heading"]}`}>Explore</li>
					<li>
						<Link href="/searchListings" passHref>
							<a>
								<p>Search listings</p>
							</a>
						</Link>
					</li>
				</ul>
			</div>

			<p className={`${styles["copy-right"]}`}>
				© {new Date().getFullYear()} Cybervolunteers. All rights reserved.
			</p>
		</div>
	);
}

export default Footer;
