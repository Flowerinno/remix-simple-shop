import { Product } from "~/services/products.server";

import styles from "../styles/home.module.css";
import { Form, Link, useRouteLoaderData } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";

interface Props {
	product: Product;
	isCheckout?: boolean;
}

export const ListItem = ({ product, isCheckout }: Props) => {
	const { store } = useRouteLoaderData<LoaderFunction>("root");

	const isAdded = store?.includes(product.id);

	return (
		<div className={styles.list_item} key={product.id}>
			<h1 className={styles.title}>
				{product.title} - {product.price}$
			</h1>
			<img
				src={product.images[0]}
				alt={`image-${product.id}`}
				width="100"
				height="100"
			/>
			<div className={styles.item_buttons}>
				<Link to={`/products/${product.id}`}>
					<button className={styles.btn}>View</button>
				</Link>
				{!isCheckout && (
					<Form method="post" action="/cart/add" navigate={false}>
						<input name="productId" type="hidden" value={product.id} />
						<button className={styles.btn} type="submit">
							{isAdded ? "Add More" : "Add to cart"}
						</button>
					</Form>
				)}
				{isCheckout && (
					<Form method="post" action="/cart/remove" navigate={false}>
						<input name="productId" type="hidden" value={product.id} />
						<button className={styles.btn} type="submit">
							Remove
						</button>
					</Form>
				)}
			</div>
		</div>
	);
};
