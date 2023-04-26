import styles from './Loading.module.css';

export const Loading = () => {
	return (
		<div className={`${styles['bouncing-loader']}`}>
			<div>🎲</div>
			<div>🎮</div>
			<div>👾</div>
		</div>
	);
};
