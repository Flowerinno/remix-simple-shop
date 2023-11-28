import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

import styles from "../styles/login.module.css";
import { getSession } from "~/services/sessions.server";

export default function Login() {
	return (
		<Form method="post" className={styles.wrapper}>
			<h2>Login</h2>
			<input
				type="email"
				name="email"
				required
				className={styles.input}
				placeholder="Email"
			/>
			<input
				className={styles.input}
				type="password"
				name="password"
				autoComplete="current-password"
				required
				placeholder="Password"
			/>
			<button className={styles.btn}>Sign In</button>
		</Form>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	return await authenticator.authenticate("user-pass", request, {
		successRedirect: "/products",
		failureRedirect: "/login",
	});
}

export async function loader({ request }: LoaderFunctionArgs) {
	return await authenticator.isAuthenticated(request, {
		successRedirect: "/products",
	});
}
