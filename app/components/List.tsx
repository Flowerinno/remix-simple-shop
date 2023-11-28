import { Product } from "~/services/products.server";
import { ListItem } from ".";

import styles from "../styles/home.module.css";

interface ListProps {
	products: Product[];
	isCheckout?: boolean;
}

export const List = ({ products, isCheckout }: ListProps) => {
	return (
		<div className={styles.products_wrapper}>
			{products.map((product: Product) => {
				return <ListItem isCheckout={isCheckout} product={product} key={product.id + Math.random()} />;
			})}
		</div>
	);
};
