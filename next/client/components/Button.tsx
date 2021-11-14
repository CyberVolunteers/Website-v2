import styles from "../styles/button.module.css";
import Link from "next/link";

function Button({
	children,
	style,
	href,
	disabled,
	onClick,
}: React.PropsWithChildren<{
	style?: React.CSSProperties;
	href?: string;
	disabled?: boolean;
	onClick?: () => void;
}>) {
	if (href !== undefined)
		return (
			<Link href={href}>
				<div
					style={style}
					className={`${styles.button} ${disabled ? styles.disabled : ""}`}
				>
					<>{children}</>
				</div>
			</Link>
		);
	else
		return (
			<button
				style={style}
				className={`${styles.button}  ${disabled ? styles.disabled : ""}`}
				onClick={onClick}
				type="submit"
			>
				{children}
			</button>
		);
}

export default Button;
