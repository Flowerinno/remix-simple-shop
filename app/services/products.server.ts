const URL = "https://dummyjson.com/products";

export interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	brand: string;
	rating?: number;
	images: string[];
}

export const getProducts = async () => {
	const data = await fetch(URL);
	const res = await data.json();
	return res;
};

export const getProduct = async (id: string | number): Promise<Product> => {
	const data = await fetch(`${URL}/${id}`);
	const res = await data.json();
	return res;
};

export const sortDesc = (products: Product[]) => {
	return [...products].sort((a, b) => b.price - a.price);
};

export const sortAsc = (products: Product[]) => {
	return [...products].sort((a, b) => a.price - b.price);
};

export const paginate = (products: Product[], page: number, limit: number) => {
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	return products.slice(startIndex, endIndex);
};
