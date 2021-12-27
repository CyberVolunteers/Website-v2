import { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { useState } from "react";
import { ReactElement } from "react";
import Head from "../../client/components/Head";
import { csrfFetch } from "../../client/utils/csrf";
import { info } from "../../client/utils/logger";
import { updateCsrf } from "../../server/csrf";

export default function Console({
	csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	const [query1, setQuery1] = useState("");
	const [query2, setQuery2] = useState("");
	const [query3, setQuery3] = useState("");
	const [type, setType] = useState("");
	const [model, setModel] = useState("");
	const [resText, setResText] = useState("");

	return (
		<div>
			<Head title="Admin" />
			<meta name="robots" content="noindex" />
			<h1>Mongo console</h1>

			<form
				onSubmit={async (evt) => {
					evt.preventDefault();
					if (type === "" || model === "")
						return setResText("select a type and a model");
					const res = await csrfFetch(
						csrfToken,
						"/api/admin_section_console/mongo",
						{
							method: "POST",
							credentials: "same-origin", // only send cookies for same-origin requests
							headers: {
								"content-type": "application/json",
								accept: "application/json",
							},
							body: JSON.stringify({
								query1,
								query2,
								query3,
								model: model.toLowerCase(),
								type: type.toLowerCase(),
							}),
						}
					);

					const resText = await res.text();

					if (res.status !== 200)
						info(
							"mongo",
							`Res declined: ${res.statusText}, resText: ${resText}`
						);

					let out;
					try {
						out = JSON.parse(resText);
						// eslint-disable-next-line
						console.log(out);
						out = JSON.stringify(out, null, "<br/>");
					} catch {
						out = resText;
					}

					// eslint-disable-next-line
					//@ts-ignore
					window.out = out;

					setResText("Response: " + out);
				}}
			>
				<input
					value={query1}
					onChange={(v) => setQuery1(v.currentTarget.value)}
				></input>
				<input
					value={query2}
					onChange={(v) => setQuery2(v.currentTarget.value)}
				></input>
				<input
					value={query3}
					onChange={(v) => setQuery3(v.currentTarget.value)}
				></input>
				<select value={type} onChange={(v) => setType(v.currentTarget.value)}>
					{type === "" ? <option>Select</option> : null}
					<option>Find</option>
					<option>Delete_all</option>
					<option>Update_all</option>
				</select>
				<select value={model} onChange={(v) => setModel(v.currentTarget.value)}>
					{model === "" ? <option>Select</option> : null}
					<option>Users</option>
					<option>Orgs</option>
					<option>Listings</option>
				</select>
				<button type="submit">submit</button>
			</form>
			{<span dangerouslySetInnerHTML={{ __html: resText }}></span>}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps<{
	csrfToken: string;
}> = async (context) => {
	return {
		props: {
			csrfToken: await updateCsrf(context),
		}, // will be passed to the page component as props
	};
};
