import styles from "../styles/button.module.css";
import Link from "next/link";

function Button({
	children,
	style,
	href,
	disabled,
	isHighlighted,
	onClick,
	outline,
	className,
}: React.PropsWithChildren<{
	style?: React.CSSProperties;
	href?: string;
	disabled?: boolean;
	onClick?: () => void;
	outline?: boolean;
	className?: string;
	isHighlighted?: boolean;
}>) {
	const underlyingClassName = `${styles.custom_button} ${styles.button} ${
		disabled ? styles.disabled : ""
	} ${outline ? styles.outline : ""} ${isHighlighted ? styles.active : ""} ${
		className ?? ""
	}`;
	if (href !== undefined)
		return (
			<Link href={href}>
				<div style={style} className={underlyingClassName}>
					<>{children}</>
				</div>
			</Link>
		);
	else
		return (
			<button
				style={style}
				className={underlyingClassName}
				onClick={onClick}
				type="submit"
			>
				{children}
			</button>
		);
}

export default Button;
