import { useEffect, useState } from 'react';

export const useCounter = (seconds: number) => {
	const [counter, setCounter] = useState(seconds);

	useEffect(() => {
		counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
	}, [counter]);

	return counter;
};
