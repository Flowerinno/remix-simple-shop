import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { useEffect } from "react";
import { List } from "~/components";
import { Product, getProducts } from "~/services/products.server";

export const meta: MetaFunction = () => {
	return [
		{ title: "Store products" },
		{ name: "description", content: "Welcome to Remix!" },
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
	];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);

	let q = url.searchParams.get("q") ?? "";

	let data = await getProducts();

	let products = data.products;

	if (q) {
		products = data.products.filter((product: Product) => {
			return product.title.toLowerCase().includes(q.toLowerCase());
		});
	}

	return json({
		products,
		q,
	});
};

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const q = formData.get("q");

	if (!q) return redirect("/products");

	const path = "/search?q=" + q;

	return redirect(path);
}

export default function SearchPage() {
	const { products, q } = useLoaderData<typeof loader>();

	useEffect(() => {
		const searchField = document.getElementById("q");
		if (searchField instanceof HTMLInputElement) {
			searchField.value = q || "";
		}
	}, [q]);

	return <List products={products} />;
}
