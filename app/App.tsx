import {
	Links,
	LiveReload,
	Meta,
	Scripts,
	ScrollRestoration,
	useOutlet,
} from "@remix-run/react";
import { Layout } from "./components";
import { AnimatePresence, motion } from "framer-motion";

export default function App() {
	const outlet = useOutlet();
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
					<AnimatePresence exitBeforeEnter initial={false}>
						<motion.main
							key={useLocation().pathname}
							initial={{ x: "-10%", opacity: 0 }}
							animate={{ x: "0", opacity: 1 }}
							exit={{ y: "-10%", opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							{outlet}
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
