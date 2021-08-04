import Link from "next/link";
import { isOrg, useIsAfterRehydration } from "../lib/client/util";

export default function MyAccount() {
    const isAfterRehydration = useIsAfterRehydration();

    return <div>
        <p>Hello and welcome to my secure website</p>

        {/* render the common stuff normally */}
        <p>
            <span>Email: {"email"}</span>
        </p>

        {/* only render the stuff that differs on client-side to not run into issues with rehydration: https://www.joshwcomeau.com/react/the-perils-of-rehydration/ */}
        {
            isAfterRehydration ?

                (isOrg() ? <>
                    <div>
                        <Link href="/manageListings" passHref>
                            <a>
                                <p>
                                    Manage listings
                                </p>
                            </a>
                        </Link>
                    </div>
                </> : <>
                    <div>
                        Do stuff as a volunteer
                    </div>
                </>)

                : null
        }

        {/* Etc */}

        <Link href="/logout" passHref>
            <a>
                <p>
                    Log out
                </p>
            </a>
        </Link>
    </div>
}
