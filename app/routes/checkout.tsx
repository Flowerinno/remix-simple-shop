import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { List } from "~/components";
import { cart } from "~/services/cart.server";
import { getProduct } from "~/services/products.server";
import { commitSession, getSession } from "~/services/sessions.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie") ?? "");
	const sessionCart = await cart(session);

	const store = sessionCart.get();

	const products = await Promise.all(store.map((id: number) => getProduct(id)));

	return json(
		{ status: 200, products },
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		}
	);
};

export default function Checkout() {
	const { products } = useLoaderData<typeof loader>();

	if (!products?.length) {
		return <div style={{ textAlign: "center" }}>Cart is empty</div>;
	}

	return <List isCheckout products={products} />;
}
