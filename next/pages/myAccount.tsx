import Link from "next/link";

export default function MyAccount() {
    return <div>
        <p>Hello and welcome to my secure website</p>

        <p>
            <p>Email: {"email"}</p>
        </p>

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
