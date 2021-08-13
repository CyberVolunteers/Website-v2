import { ReactElement } from "react";
import { useViewProtection } from "../client/utils/otherHooks";
import Link from "next/link";
import Head from "../client/components/Head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { Org } from "../server/mongo/mongoModels";

//@ts-ignore
import ObjectId from "mongoose/lib/types/objectid";
import Card from "../client/components/Card";

export default function ManageListings({ listings }: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
	useViewProtection(["org"]);
	console.log(listings)

	return <div>
		<Head title="Manage listings - cybervolunteers" />
		<h1>Don&#39;t go crazy with your power!</h1>

		<div className="listings">
			{
				listings.map((l, i) => {
					console.log(l)
					const listingData = {
						img: l.imagePath,
						title: l.title, 
						organisationName: l.orgName, 
						desc: l.desc, 
						currentVolunteers: l.currentNumVolunteers, 
						requestedVolunteers: l.requestedNumVolunteers, 
						uuid: l.uuid
					}
					return <Card key={i} {...listingData} />
				})
			}
		</div>

		<Link href="/createListing" passHref>
			<a>
				<p>
					We need more listings!
				</p>
			</a>
		</Link>
	</div>;
}

export const getServerSideProps: GetServerSideProps<{
	listings: any[] //{[key: string]: any}[]
}> = async (context) => {
	const session = await getSession(context.req as ExtendedNextApiRequest);
	const org = (await Org.findById(session._id).populate("listings")).toJSON({
		versionKey: false,
		transform: (doc: any, out: any) => {
			Object.keys(out).forEach(k => {
				if (out[k] instanceof ObjectId) return delete out[k]; // delete all the id keys
				if (out[k] instanceof Date) return out[k] = out[k].toISOString(); // delete all the id keys
			})
			return out;
		}
	}); // TODO: maybe try aggregate? some people say it's faster
	const orgName = org.orgName;

	const listings = org.listings;
	listings.forEach((l: any) => l.orgName = orgName);

	return {
		props: {
			listings
		}, // will be passed to the page component as props
	};
};
