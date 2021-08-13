import { Button, capitalize } from "@material-ui/core";
import React from "react";
import { ReactElement } from "react";
import Head from "../client/components/Head";

export default function Listing(): ReactElement {
	const listing = {
		title: "test test test"
	}
	return <div>
		<Head title={`${capitalize(listing.title)} - cybervolunteers`}/>
		<h1>This is a listing title</h1>

		<p>
			<span>Desc: {"bla bla bla"}</span>
		</p>

		{/* Etc */}

		<Button>
			<p>
				want to help
			</p>
		</Button>
	</div>;
}
