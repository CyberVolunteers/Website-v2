import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import styles from "../styles/card.module.css";
import {
	cleanStylisedText,
	doEllipsis,
	handleStylisedTextRender,
} from "../utils/misc";

const minLogoRatio = 2;

function Card({
	imagePath,
	title,
	organisationName,
	desc,
	currentVolunteers,
	requestedVolunteers,
	uuid,
}: {
	imagePath: string;
	title: string;
	organisationName: string;
	desc: string;
	currentVolunteers?: number;
	requestedVolunteers?: number;
	uuid: string;
}) {
	// title = doEllipsis(cleanStylisedText(title, true), 30);
	organisationName = doEllipsis(cleanStylisedText(organisationName, true), 30);
	desc = doEllipsis(cleanStylisedText(desc, true), 130);

	const [isLogo, setIsLogo] = useState(false);

	const id = `listing_card_image_${uuid}`;

	return (
		<div className={`${styles["Card"]}`}>
			{typeof imagePath !== "string" ||
			imagePath.length === 0 ||
			imagePath[0] !== "/" ? null : (
				<div className={`${styles["card-image-container"]} img-container`}>
					<Image
						id={id}
						src={imagePath}
						// width={100}
						// height={100}
						sizes={"30vw"}
						layout="fill"
						objectPosition={`center ${isLogo ? "center" : "top"}`}
						objectFit="contain"
						alt="Listing image"
						onLoadingComplete={({}) => {
							// the problem is that sometimes the image dimensions are 0 even if we are told that the image has been loaded.
							// we need to wait for a bit and then see if the dimensions are present
							// keep on retrying to check
							let tries = 0;
							let interval = setInterval(() => {
								if (tries > 1000 / 30) {
									// stop the repeated retries
									clearInterval(interval);
								}

								// get the actual width and height
								const imgEl = document.getElementById(
									id
								) as HTMLImageElement | null;
								const width = imgEl?.naturalWidth ?? 0;
								const height = imgEl?.naturalHeight ?? 0;

								if (width === 0 && height === 0) return tries++;
								// stop the repeated retries
								clearInterval(interval);

								const ratio = width / height;
								if (ratio > minLogoRatio) setIsLogo(true);
							}, 30);
						}}
					/>
				</div>
			)}
			<div className={styles.bottom}>
				<h3 className={`${styles.title} bold`}>{title}</h3>
				<h4 className={styles.organisationName}>{organisationName}</h4>
				<p className={styles.description}>
					{desc}

					<Link href={`/listing?uuid=${uuid}`} passHref>
						<a style={{ color: "#F85220" }}>Read more</a>
					</Link>
				</p>

				{currentVolunteers !== undefined &&
				requestedVolunteers !== undefined ? (
					<>
						<div className={`${styles["meter-total"]}`}>
							<div
								className={`${styles["meter"]}`}
								style={{
									width: (currentVolunteers / requestedVolunteers) * 100 + "%",
								}}
							></div>
						</div>

						<span className={`${styles["volunteers-progress-bar"]}`}>
							{currentVolunteers}/{requestedVolunteers} volunteers
						</span>
					</>
				) : null}

				<div className={`${styles["submittion-area"]} dflex-align-center`}>
					<Link href={`/listing?uuid=${uuid}`} passHref>
						<a className={`${styles["volunteer-now"]}`}>
							<p>Volunteer Now</p>
						</a>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Card;
