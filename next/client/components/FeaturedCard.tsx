import Image from "next/image";
import Link from "next/link";
import React from "react";

import styles from "../styles/featuredCard.module.css";

function FeaturedCard({
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
	return (
		<div className={`${styles["FeaturedCard"]} w-1000`}>
			<div className={`img-container`}>
				<Image
					src={imagePath}
					// width={100}
					// height={100}
					sizes={"40vw"}
					layout="fill"
					objectFit="contain"
					alt="Featured listing image"
				/>
			</div>

			<div className={`${styles["presentation"]}`}>
				<h3 className={`${styles["title"]} bold`}>{title}</h3>
				<h4 className={`${styles["organisationName"]}`}>{organisationName}</h4>

				<p className={`${styles["description"]}`}>
					{desc}

					<Link href={`/listing?uuid=${uuid}`} passHref>
						<a>Read more</a>
					</Link>
				</p>

				{currentVolunteers !== undefined &&
				requestedVolunteers !== undefined ? (
					<>
						<div className={`${styles["meter-total"]}`}>
							<div
								className={`${styles["meter"]}`}
								style={{
									width: (currentVolunteers / requestedVolunteers) * 100 + "%", //TODO: set this
								}}
							></div>
						</div>
						<span className={`${styles["volunteers-progress-bar"]}`}>
							{currentVolunteers}/{requestedVolunteers} volunteers
						</span>
					</>
				) : null}

				<Link href={`/listing?uuid=${uuid}`} passHref>
					<a className={`${styles["volunteer-now"]}`}>
						<p>Volunteer Now</p>
					</a>
				</Link>
			</div>
		</div>
	);
}

export default FeaturedCard;
