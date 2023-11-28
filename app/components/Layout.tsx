import styles from "../styles/layout.module.css";
import { Header } from "./Header";
import { Loader } from ".";
import { useEffect, useState } from "react";

interface Props {
	children: React.ReactNode;
}

export function Layout({ children }: Props) {
	const [timer, setTimer] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			if (timer > 0) {
				setTimer((prev) => prev - 1);
			}
		}, 1000);

		if (timer === 0) {
			clearInterval(interval);
		}

		return () => clearInterval(interval);
	}, [timer]);

	if (timer > 0) {
		return <Loader />;
	}

	return (
		<div className={styles.container}>
			<Header />
			{children}
		</div>
	);
}
