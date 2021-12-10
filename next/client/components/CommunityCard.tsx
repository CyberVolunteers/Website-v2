import React from "react";
// TODO: do this
// import "../../Assets/styles/css/Community-Cards.module.css";
function Card({
	title,
	subtitle,
	text,
	img_src,
}: {
	title: string;
	subtitle: string;
	text: string;
	img_src: string;
}) {
	return (
		<div className="Card community-card">
			<img src={img_src} alt="" />
			<p>{text}</p>

			<h4>{title}</h4>
			<p>{subtitle}</p>
		</div>
	);
}

export default Card;
