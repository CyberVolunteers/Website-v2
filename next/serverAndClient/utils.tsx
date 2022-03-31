import styles from "../client/styles/simplePage.module.css";
import { NextRouter, Router, useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { useIsAfterRehydration } from "../client/utils/otherHooks";
import { useViewerType } from "../client/utils/userState";
import Head from "../client/components/Head";

const postcodeRE =
	/^([Gg][Ii][Rr]0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))[0-9][A-Za-z]{2})$/;

export function cleanPostcode(p: string) {
	return p.replaceAll(/[^0-9a-zA-Z]/g, "");
}
export function isPostcode(p: string): boolean {
	return postcodeRE.test(cleanPostcode(p));
}

export function getFileExtension(input: string) {
	const lastIndex = input.lastIndexOf(".");
	if (lastIndex === -1) return null;
	return input.slice(lastIndex);
}

export function isAllNonEmptyStrings(obj: { [key: string]: any }): boolean {
	return Object.values(obj).every((v) => typeof v === "string" && v !== "");
}

export function RedirectWithErrorMessage({
	hasToBeUser: _hasToBeUser,
	hasToBeVerified: _hasToBeVerified,
}: {
	hasToBeUser?: boolean;
	hasToBeVerified?: boolean;
}): ReactElement {
	const hasToBeUser = _hasToBeUser ?? false;
	const hasToBeVerified = _hasToBeVerified ?? false;

	const params = {
		showLoginRequirementMessage: true,
		hasToBeUser,
		hasToBeVerified,
	};

	const router = useRouter();
	const isAfterRehydration = useIsAfterRehydration();
	const userType = useViewerType();

	useEffect(() => {
		if (isAfterRehydration) {
			if (hasToBeVerified && userType === "unverified_org")
				router.replace("/organisationVerificationNotification");
			else router.replace(`/login?${new URLSearchParams(params as any)}`);
		}
	});

	return (
		<>
			<Head title="Something went wrong - cybervolunteers" />
			<div className={styles.container}>
				<h1 className={styles.main_heading}>Redirecting...</h1>
			</div>
		</>
	);
}
