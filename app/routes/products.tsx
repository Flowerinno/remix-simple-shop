import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import {
	getProducts,
	sortAsc,
	sortDesc,
	paginate,
} from "~/services/products.server";

import styles from "../styles/home.module.css";
import { List } from "~/components";

export const meta: MetaFunction = () => {
	return [
		{ title: "Store products" },
		{ name: "description", content: "Welcome to Remix!" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
	];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	let pagination = url.searchParams.get("page") ?? 1;
	const order = url.searchParams.get("orderby");
	const q = url.searchParams.get("q");

	if (q) {
		return redirect(`/products/search`);
	}

	let data = await getProducts();

	let products = data.products;

	if (order) {
		products =
			order === "desc" ? sortDesc(data.products) : sortAsc(data.products);
	}

	const totalPages = Math.ceil(data.products.length / 5);

	if (+pagination > totalPages) {
		pagination = 1;
	}

	products = paginate(products, +pagination, 5);

	return json({
		products,
		order,
		page: pagination,
		totalPages: totalPages,
	});
};

export default function Index() {
	const { products, order, page, totalPages } = useLoaderData<typeof loader>();
	const [currentPage, setCurrentPage] = useState(page);

	const submit = useSubmit();

	return (
		<div
			className={styles.container}
			style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}
		>
			<Form
				className={styles.filters_container}
				role="filter"
				onChange={(e) => submit(e.currentTarget)}
			>
				<div className={styles.orderby_container}>
					<label htmlFor="orderby">Order by</label>
					<select
						name="orderby"
						className={styles.orderby}
						defaultValue={order ?? ""}
					>
						<option value=""></option>
						<option value="desc">Descending</option>
						<option value="asc">Ascending</option>
					</select>
				</div>
				<div className={styles.pagination}>
					{Array.from({ length: totalPages }, (_, i) => {
						return (
							<button
								key={i}
								type="submit"
								name="page"
								onClick={() => setCurrentPage(i + 1)}
								value={i + 1}
								className={
									+currentPage === i + 1
										? `${styles.pagination_item} ${styles.active}`
										: `${styles.pagination_item}`
								}
							>
								{i + 1}
							</button>
						);
					})}
				</div>
			</Form>

			<List products={products} />
		</div>
	);
}
