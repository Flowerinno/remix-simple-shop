import { Link, useLocation } from "@remix-run/react";

import styles from "../styles/breadcrumbs.module.css";

interface Props {
	title: string;
}

export function Breadcrumbs({ title }: Props) {
	const crumbs = ["Products", title];

	return (
		<ul className={styles.container}>
			{crumbs.map((crumb, index) => {
				return (
					<Link to={`/${crumb}`} className={styles.crumb} key={index}>
						<li key={index}>
							{crumb} {index !== crumbs.length - 1 ? ">" : ""}
						</li>
					</Link>
				);
			})}
		</ul>
	);
}
