import Link from "next/link";
import { ReactElement } from "react";

export default function SignupSelect(): ReactElement {

	return <div>
		<p>
			Hello and welcome to my secure website
		</p>

		<p>
			Please choose who you want to sign up as
		</p>

		<Link href="/userSignup" passHref>
			<a>
				<p>
					I am a volunteer
				</p>
			</a>
		</Link>
		<Link href="/organisationSignup" passHref>
			<a>
				<p>
					I am an organisation
				</p>
			</a>
		</Link>

		<Link href="/login" passHref>
			<a>
				<p>Or hey, do you want to log in?</p>
			</a>
		</Link>
	</div>;
}
