import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import { useIsAfterRehydration, getViewerType } from "../lib/client/util"

export default function NotAllowed() {
    const router = useRouter()
    const currentUser = getViewerType()
    const isAfterHydration = useIsAfterRehydration()

    return <div>
        {
            (() => {
                if (!isAfterHydration) return null;
                switch (currentUser) {
                    case "org":
                        return <p>Please log in as a volunteer to view that page</p>
                    case "user":
                        return <p>Please log in as an organisation to view that page</p>
                    default:
                        return <p>Please log in to view that page</p>
                }
            })()
        }
        <Link href={`/login?redirect=${router.query.redirect ?? ""}`} passHref>
            <a>
                <p>
                    Log in!
                </p>
            </a>
        </Link>
    </div>
}
