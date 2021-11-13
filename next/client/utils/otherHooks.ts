import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { ViewerType } from "../types";
import { useViewerType } from "./userState";

export function useWindowSize() {
	const [windowSize, setWindowSize] = useState({
		width: undefined,
		height: undefined,
	} as {
		width?: number;
		height?: number;
	});

	useEffect(() => {
		// only execute all the code below in client side
		if (typeof window !== "undefined") {
			function handleResize() {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}
			window.addEventListener("resize", handleResize);

			handleResize(); // resize now

			// Remove event listener on cleanup
			return () => window.removeEventListener("resize", handleResize);
		}
	}, []); // Empty array ensures that effect is only run on mount
	return windowSize;
}

export function useIsAfterRehydration() {
	const [isFirstRender, setIsFirstRender] = useState(false);
	useEffect(() => setIsFirstRender(true), []);
	return isFirstRender;
}

/**
 * Redirects the used if the user is not allowed to view that page
 * @param allow User types to allow
 * @returns whether the user is allowed
 */
export function useViewProtection(allow: ViewerType[]) {
	const router = useRouter();
	const currentViewType = useViewerType();
	const [out, setOut] = useState(true);

	useEffect(() => {
		if (currentViewType === "hydrating") return; // race conditions are fun
		if (!allow.includes(currentViewType)) {
			if (currentViewType !== "server")
				router.replace(
					`/notAllowed?${new URLSearchParams({
						redirect: encodeURI(router.asPath),
						required: JSON.stringify(allow),
					})}`
				);
			return setOut(false);
		}

		return setOut(true);
	}, [currentViewType]);

	return out;
}
