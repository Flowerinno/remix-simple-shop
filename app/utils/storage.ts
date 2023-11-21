import { Product } from "~/services/products.server";

export const saveToStorage = (key: string, value: Product) => {
	const storage = getFromStorage(key);

	for (const product of storage) {
		if (product.id === value.id) {
			const res = confirm(
				"This product is already in your cart, do you want to add another one?"
			);

			if (res) {
				break;
			}
			return;
		}
	}

	if (storage) {
		window.localStorage.setItem(key, JSON.stringify([value, ...storage]));
	}
	return;
};

export const getFromStorage = (key: string) => {
	if (typeof window !== "undefined") {
		const item = window.localStorage.getItem(key);
		if (item) {
			return JSON.parse(item);
		}
		return [];
	}
};
