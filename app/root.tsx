import {
	type ActionFunctionArgs,
	type LinksFunction,
	type LoaderFunctionArgs,
	json,
} from "@remix-run/node";
import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
} from "@remix-run/react";
import { cssBundleHref } from "@remix-run/css-bundle";

import appCSS from "./styles/app.css";
import { Layout } from "./components";
import { commitSession, getSession } from "./services/sessions.server";
import { cart } from "./services/cart.server";
import { AnimatePresence, motion } from "framer-motion";

export const links: LinksFunction = () => [
	...(cssBundleHref
		? [
				{ rel: "stylesheet", href: cssBundleHref },
				{
					rel: "stylesheet",
					href: appCSS,
				},
		  ]
		: []),
];

export function ErrorBoundary() {
	return (
		<html>
			<head>
				<title>Oh no!</title>
				<Meta />
				<Links />
			</head>
			<body>
				<Link to="/products">Seems like something went wrong...</Link>
				<Outlet />
				<Scripts />
			</body>
		</html>
	);
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const session = await getSession(request.headers.get("Cookie"));

	const sessionCart = await cart(session);

	return json(
		{
			sessionCart,
			store: sessionCart.get(),
		},
		{
			headers: {
				"Set-Cookie": await commitSession(session),
			},
		}
	);
};

export const action = async ({ request }: ActionFunctionArgs) => {
	return { status: 200 };
};

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Layout>
					<AnimatePresence mode="wait" initial={false}>
						<motion.main
							key={useLocation().pathname}
							initial={{ opacity: 0.5 }}
							animate={{ x: "0", opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Outlet />
						</motion.main>
					</AnimatePresence>
				</Layout>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
