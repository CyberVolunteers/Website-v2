import React from "react";
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
			<p className="community_card_text">{text}</p>

			<h4 className="bold">{title}</h4>
			<p>{subtitle}</p>
		</div>
	);
}

export default Card;
