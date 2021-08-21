import { ReactElement } from "react";
import { useViewProtection } from "../client/utils/otherHooks";
import Link from "next/link";
import Head from "../client/components/Head";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "../server/auth/auth-cookie";
import { ExtendedNextApiRequest } from "../server/types";
import { Org } from "../server/mongo/mongoModels";
import { getMongo } from "../server/mongo";
import Card from "../client/components/Card";
import { toStrippedObject } from "../server/mongo/util";

export default function ManageListings({
  listings,
}: InferGetServerSidePropsType<typeof getServerSideProps>): ReactElement {
  useViewProtection(["org"]);

  return (
    <div>
      <Head title="Manage listings - cybervolunteers" />
      <h1>Don&#39;t go crazy with your power!</h1>

      <div className="listings">
        {listings.map((l, i) => {
          const listingData = {
            imagePath: l.imagePath,
            title: l.title,
            organisationName: l.orgName,
            desc: l.desc,
            currentVolunteers: l.currentNumVolunteers,
            requestedVolunteers: l.requestedNumVolunteers,
            uuid: l.uuid,
          };
          return <Card key={i} {...listingData} />;
        })}
      </div>

      {/* TODO: show it when there are no listings here */}

      <Link href="/createListing" passHref>
        <a>
          <p>We need more listings!</p>
        </a>
      </Link>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  listings: any[]; //{[key: string]: any}[]
}> = async (context) => {
  await getMongo(); // connect
  const session = await getSession(context.req as ExtendedNextApiRequest);
  const org = toStrippedObject(
    await Org.findById(session._id).populate("listings")
  ); // TODO: maybe try aggregate? some people say it's faster
  const orgName = org.orgName;

  const listings = org.listings;
  listings.forEach((l: any) => {
    l.orgName = orgName;
    delete l.place;
  });

  console.log(listings);

  return {
    props: {
      listings,
    }, // will be passed to the page component as props
  };
};
