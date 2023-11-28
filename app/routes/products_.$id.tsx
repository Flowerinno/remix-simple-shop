import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, MetaFunction, useFetcher } from "@remix-run/react";
import { getProduct } from "../services/products.server";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";

import styles from "../styles/product.module.css";

import { Breadcrumbs } from "~/components";
import { commitSession, getSession } from "~/services/sessions.server";
import { cart } from "~/services/cart.server";

import mediumZoom, { ZoomSelector } from "medium-zoom";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	return [
		{
			title: data?.product.title,
		},
		{
			property: "og:title",
			content: data?.product.title,
		},
		{
			property: "og:description",
			content: data?.product.description,
		},
		{
			property: "og:image",
			content: data?.product.images[0],
		},
	];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
	const { id } = params;
	invariant(id, "No such product-id provided");

	try {
		const session = await getSession(request.headers.get("Cookie"));
		const sessionCart = await cart(session);
		const isAdded = sessionCart.get().includes(Number(id));

		const data = await getProduct(id);
		return json(
			{ product: data, isAdded },
			{
				headers: {
					"Set-Cookie": await commitSession(session),
				},
			}
		);
	} catch (error) {
		throw new Error("No such product");
	}
}

export const action = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const productId = formData.get("productId");

	invariant(productId, "No such product-id");

	const session = await getSession(request.headers.get("Cookie"));
	const sessionCart = await cart(session);

	sessionCart.add(Number(productId));
	const store = sessionCart.get();

	return json(
		{ store },
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		}
	);
};

export default function Product() {
	const { product, isAdded } = useLoaderData<typeof loader>();
	const fetcher = useFetcher();

	const [image, setImage] = useState(product.images[0]);
	const [isZoomed, setIsZoomed] = useState(false);

	const imageHandler = (img: string) => {
		setImage(img);
	};

	const handleZoom = () => {
		if (isZoomed) {
			setIsZoomed(false);
			return;
		}

		const element = document.getElementById("zoom-image") as HTMLElement;
		if (element && element.parentElement) {
			mediumZoom(element, {
				background: "transparent",
				container: element.parentElement,
			});
			setIsZoomed(true);
		}
	};

	return (
		<div className={styles.product_container}>
			<Breadcrumbs title={product.title} />
			<div className={styles.wrapper}>
				<header className={styles.header}>
					<h1 className={styles.product_title}>
						{product.title} - {product.brand}
					</h1>
				</header>
				<section className={styles.body}>
					<div className={styles.image_container}>
						<img
							id="zoom-image"
							className={styles.preview}
							src={image}
							alt={`image-${product.id}`}
							onClick={handleZoom}
							onMouseLeave={() => setIsZoomed(false)}
						/>

						<div className={styles.image_gallery}>
							{product.images.map((img, i) => {
								return (
									<img
										key={i}
										width="50"
										height="50"
										src={img}
										className={styles.image_gallery_item}
										onClick={() => imageHandler(img)}
									/>
								);
							})}
						</div>
					</div>

					<div className={styles.description}>
						<h2 className={styles.price}>Only today for {product.price}$</h2>
						<p>Rating: {product.rating}</p>
						<p>{product.description}</p>
						<fetcher.Form method="post" className={styles.buy}>
							<input name="productId" type="hidden" value={product.id} />
							<button type="submit" className={styles.buy}>
								{isAdded ? "Add More" : "Add to cart"}
							</button>
						</fetcher.Form>
					</div>
				</section>
			</div>
		</div>
	);
}
