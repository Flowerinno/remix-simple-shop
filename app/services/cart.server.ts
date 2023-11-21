import { Session } from "@remix-run/node";
import { destroySession } from "./sessions.server";

const store: string[] = [];

export class Cart {
	private static instance: Cart;
	private session: Session;

	private constructor(session: Session) {
		this.session = session;
	}

	static getInstance(session: Session): Cart {
		if (!Cart.instance) {
			Cart.instance = new Cart(session);
		}
		return Cart.instance;
	}

	initiate() {
		return this.session.set("store", store);
	}

	async resetSession() {
		return await destroySession(this.session);
	}

	add(productId: number) {
		const store = this.get();
		store.push(productId);
		this.session.set("store", store);
	}

	remove(productId: number) {
		const store = this.get();
		const index = store.indexOf(productId);
		if (index > -1) {
			store.splice(index, 1);
		}
		this.session.set("store", store);
	}

	get() {
		return this.session.get("store") || [];
	}
}

export const cart = async (session: Session) => Cart.getInstance(session);
