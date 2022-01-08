import React, { useState } from "react";
import Link from "next/link";

function CustomForm({
	children,
	headingText,
	headingLinkText,
	headingLinkHref,
	subheadingText,
	onSubmit,
}: React.PropsWithChildren<{
	headingText: React.ReactNode | string;
	headingLinkText?: React.ReactNode | string;
	headingLinkHref?: string;
	subheadingText: React.ReactNode | string;
	onSubmit?: React.FormEventHandler<HTMLFormElement>;
}>) {
	return (
		<form className="custom-form" onSubmit={onSubmit}>
			<p className="header" style={{ fontWeight: "bold" }}>
				{headingText}{" "}
				{headingLinkHref === undefined ||
				headingLinkText === undefined ? null : (
					<Link href={headingLinkHref}>{headingLinkText}</Link>
				)}
			</p>
			{/* Can not be touched or it will break css */}
			<p className="welcom-message" style={{ display: "none" }}></p>
			<p className="helper">{subheadingText}</p>

			{children}
		</form>
	);
}

export default CustomForm;
