import styles from "../styles/layout.module.css";

import { Header } from "./Header";

interface Props {
	children: React.ReactNode;
}

export function Layout({ children }: Props) {
	return (
		<div className={styles.container}>
			<Header />
			{children}
		</div>
	);
}
