import styles from './Loading.module.css';

export default function Loading({ message }: { message?: string }) {
	return (
		<div className="flex flex-column align-items-center">
			{message ? <p className="font-bold mb-5">{message}</p> : null}
			<div className={`${styles['bouncing-loader']}`}>
				<div>🎲</div>
				<div>🎮</div>
				<div>👾</div>
			</div>
		</div>
	);
}
