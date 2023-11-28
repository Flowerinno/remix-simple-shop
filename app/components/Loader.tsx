import styles from "../styles/loader.module.css";

export function Loader() {
	return (
		<div className={styles.container}>
			<h2>Verifying connection details...</h2>
			<div className={styles.loader}></div>
		</div>
	);
}
