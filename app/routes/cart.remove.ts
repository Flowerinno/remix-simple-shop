import { ActionFunctionArgs, json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { cart } from "~/services/cart.server";
import { commitSession, getSession } from "~/services/sessions.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const productId = formData.get("productId");

	invariant(productId, "No such product-id");

	const session = await getSession(request.headers.get("Cookie"));
	const sessionCart = await cart(session);

	sessionCart.remove(Number(productId));

	return json(
		{ status: 200 },
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		}
	);
};
