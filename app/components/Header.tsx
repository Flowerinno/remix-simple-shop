import styles from "../styles/header.module.css";

import Logo from "../assets/Logo.webp";
import {
	Form,
	Link,
	useLocation,
	useRouteLoaderData,
	useSubmit,
} from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";

export function Header() {
	const { store } = useRouteLoaderData<LoaderFunction>("root");
	const location = useLocation();

	const submit = useSubmit();

	const isSearchPage = location.pathname === "/search";

	const submitHandler = (e: React.KeyboardEvent<HTMLFormElement>) => {
		if (e.key === "Enter") {
			submit(e.currentTarget, {
				replace: !isSearchPage,
			});
		}
	};

	return (
		<div className={styles.container}>
			<Link to="/products">
				<img src={Logo} alt="Logo Cannabis Shop" className={styles.logo} />
			</Link>
			<Form
				role="search"
				onKeyDown={(e) => submitHandler(e)}
				method="post"
				action="/search"
			>
				<input
					id="q"
					name="q"
					type="search"
					aria-label="Search products"
					className={styles.search_input}
					placeholder="Search..."
				/>
			</Form>
			<div className={styles.links_container}>
				<Link to="/checkout" className={styles.link}>
					<div className={styles.store}>S</div>
					<span className={styles.store_count}>
						{(store && store?.length) ?? ""}
					</span>
				</Link>
			</div>
		</div>
	);
}
