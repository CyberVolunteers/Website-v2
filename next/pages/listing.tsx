import { Button } from "@material-ui/core";
import React from "react";
import { ReactElement } from "react";

export default function Listing(): ReactElement {
	return <div>
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
