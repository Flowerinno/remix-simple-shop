import { prisma } from "./db.server";
import { Products } from "@prisma/client";

const URL = "https://dummyjson.com/products";

export const getMockedProducts = async () => {
	const data = await fetch(URL);
	const res = await data.json();
	return res;
};

export const syncDB = async () => {
	const data = await getMockedProducts();
	for (const obj of data.products) {
		const { id, title, description, price, brand, rating, images } = obj;
		await prisma.products.upsert({
			where: { id },
			update: { title, description, price, rating, brand, images },
			create: { id, title, description, rating, price, brand, images },
		});
	}
};

export const getProducts = async (): Promise<Products[]> => {
	const data = await prisma.products.findMany();
	return data;
};

export const getProduct = async (
	id: string | number
): Promise<Products | null> => {
	const data = await prisma.products.findUnique({
		where: { id: Number(id) },
	});

	return data;
};

export const sortDesc = (products: Products[]) => {
	return [...products].sort((a, b) => b.price - a.price);
};

export const sortAsc = (products: Products[]) => {
	return [...products].sort((a, b) => a.price - b.price);
};

export const paginate = (products: Products[], page: number, limit: number) => {
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	return products.slice(startIndex, endIndex);
};
