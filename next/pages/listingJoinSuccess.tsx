import Link from "next/link";
import React, { ReactElement } from "react";
import Head from "../client/components/Head";

export default function ListingJoinSuccess(): ReactElement {
  return (
    <div>
      <Head title="Joined successfully - cybervolunteers" />
      <h1>We have added you to this opportunity</h1>
      <p>The charity has been notified.</p>
      <Link href="/searchListings" passHref>
        <a>
          <p>Back to the search page!</p>
        </a>
      </Link>
      {/* TODO: notify the charity */}
    </div>
  );
}
