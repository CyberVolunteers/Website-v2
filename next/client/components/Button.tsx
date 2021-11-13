import styles from "../styles/button.module.css";
import Link from "next/link";

function Button({
	children,
	style,
	href,
	onClick,
}: React.PropsWithChildren<{
	style?: React.CSSProperties;
	href?: string;
	onClick?: () => void;
}>) {
	if (href !== undefined)
		return (
			<Link href={href}>
				<div style={style} className={styles.button}>
					<>{children}</>
				</div>
			</Link>
		);
	else
		return (
			<button style={style} className={styles.button} onClick={onClick}>
				{children}
			</button>
		);
}

export default Button;
