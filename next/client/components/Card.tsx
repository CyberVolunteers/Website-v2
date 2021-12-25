import Image from "next/image";
import Link from "next/link";
import React from "react";

import styles from "../styles/card.module.css";
import { doEllipsis } from "../utils/misc";

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
	title = doEllipsis(title, 30);
	organisationName = doEllipsis(organisationName, 30);
	desc = doEllipsis(desc, 160);

	return (
		<div className={`${styles["Card"]}`}>
			{typeof imagePath !== "string" ||
			imagePath.length === 0 ||
			imagePath[0] !== "/" ? null : (
				<div className={`${styles["card-image-container"]} img-container`}>
					<Image
						src={imagePath}
						// width={100}
						// height={100}
						sizes={"30vw"}
						layout="fill"
						objectPosition="center top"
						objectFit="contain"
						alt="Listing image"
					/>
				</div>
			)}
			<div className={`${styles["bottom"]}`}>
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
