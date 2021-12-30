import React, { RefObject, useRef } from "react";
import { cleanStylisedText, doEllipsis } from "../utils/misc";
import Button from "./Button";
import Link from "next/link";
import { useRouter } from "next/router";

const StyleSheet = {
	SubTitle: {
		color: "rgb(117, 108, 108)",
		fontWeight: "bold",
		fontSize: "1rem",
		display: "inline-block",
		height: "40px",
		marginBottom: "8px",
	},
	TotalGo: {
		color: "#f85220",
		fontSize: "14px",
	},
	MeterTotal: {
		width: "100%",
		height: "5px",
		marginTop: " 10px",
		marginBottom: " 15px",
		backgroundColor: "#d8d8d8",
		position: "relative",
		borderRadius: "10px",
	},
	MeterCome: {
		width: "30%",
		backgroundColor: "#f85220",
		height: "100%",
		position: "absolute",
		left: "0",
		borderRadius: " 10px",
		top: "0",
	},
	Card: {},
	Title: {
		marginBottom: "8px",
		minHeight: "3rem",
	},
	Desc: {
		height: "62px",
		fontWeight: "bold",
	},
};
function IndexCard({
	uuid,
	img,
	title,
	subtitle,
	desc,
	divRef,
}: /*meternow, totalgo*/
{
	img: string;
	uuid: string;
	title: string;
	subtitle: string;
	desc: string;
	divRef?: RefObject<HTMLDivElement>;
}) {
	const router = useRouter();

	title = doEllipsis(cleanStylisedText(title, true), 60);
	subtitle = doEllipsis(cleanStylisedText(subtitle, true), 40);
	desc = doEllipsis(cleanStylisedText(desc, true), 90);

	return (
		<div
			ref={divRef}
			className="card-wrapper"
			style={{ padding: "3rem 1.5rem" }}
		>
			<div
				className="Card"
				style={{
					boxShadow: "0 0.65rem 0.875rem 0.4375rem rgb(153 153 153 / 10%)",
					borderRadius: "10px",
				}}
			>
				<img
					src={img}
					style={{
						height: "160px",
						width: "100%",
						borderTopLeftRadius: "10px",
						borderTopRightRadius: "10px",
					}}
				/>
				<div
					className="bottom"
					style={{
						borderBottomLeftRadius: "10px",
						borderBottomRightRadius: "10px",
						padding: "1.5rem 1rem",
						paddingTop: "1rem",
					}}
				>
					<h3 className="title bold" style={StyleSheet.Title}>
						{title}
					</h3>
					<p className="subtitle" style={StyleSheet.SubTitle}>
						{subtitle}{" "}
						{/* <span className="total-go" style={StyleSheet.TotalGo}>
							{totalgo}$ to go
						</span> */}
					</p>
					{/* <div className="meter-total" style={StyleSheet.MeterTotal}>
						<div
							className="meter"
							style={{ width: `${meternow}%`, ...StyleSheet.MeterCome }}
						></div>
					</div> */}
					<p className="description" style={StyleSheet.Desc}>
						{desc}{" "}
						<Link href={`/listing?uuid=${uuid}`} passHref>
							<a
								style={{ color: "#F85220" }}
								onPointerDown={() => {
									router.push(`/listing?uuid=${uuid}`);
								}}
							>
								Read more
							</a>
						</Link>
					</p>

					<div
						onPointerDown={() => {
							router.push(`/listing?uuid=${uuid}`);
						}}
						className="submittion-area dflex-align-center"
					>
						<Button
							className="lend-now"
							style={{
								textAlign: "center",
								backgroundColor: "#f85220",
								border: "none",
								color: "#fff",
								padding: "1rem 2rem",
								fontSize: "1rem",
								cursor: "pointer",
								marginTop: "15px",
								width: "100%",
								fontWeight: "600",
							}}
						>
							<div>Volunteer Now</div>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default IndexCard;
