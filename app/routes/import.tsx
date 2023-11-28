import { redirect } from "@remix-run/node";
import { syncDB } from "~/services/products.server";

export async function loader() {
	await syncDB();
	console.log("DB IS SYNCED");
	return redirect("/products");
}

export default function Sync() {
	return (
		<div>
			<h1>Sync</h1>
		</div>
	);
}
