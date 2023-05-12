import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import { useRoomContext } from '@src/contexts';
import { useCounter } from '@src/hooks';

const GRID_SIZE = 36;

type BeatTimerProps = {
	flippedItems: number | undefined;
	handleScore: (score: number) => void;
};

const getFlippedIndexes = (flippedItems: number) =>
	[...Array(GRID_SIZE).keys()]
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
		.slice(0, flippedItems);

export default function BeatTimer({ flippedItems = 1, handleScore }: BeatTimerProps) {
	const { room } = useRoomContext();
	const counter = useCounter(3);
	const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
	const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

	useEffect(() => {
		if (flippedIndexes.length === 0) {
			setFlippedIndexes(getFlippedIndexes(flippedItems));
		}
		if (counter === 0) {
			handleScore(selectedIndexes.length);
		}
	}, [flippedItems, flippedIndexes, selectedIndexes, counter, handleScore]);

	const handleSelection = (selectedItem: number) => {
		if (flippedIndexes.includes(selectedItem)) {
			setSelectedIndexes((prevSelected) => [...prevSelected, selectedItem]);
		}
	};

	return (
		<div className="grid">
			<div className="col-12 flex justify-content-between">
				<p className="font-bold text-xl">👤 {room?.player?.name}</p>
				<p className="font-bold text-xl">{counter} ⏳</p>
			</div>
			<Divider className="my-1" />
			<small className=" col-12 flex justify-content-center font-bold">
				Find the flipped icons 🔭
			</small>
			<div className="grid">
				{[...Array(GRID_SIZE).keys()].map((key) => (
					<div className="col-2" key={`item-${key}`}>
						<Button
							text
							rounded
							className={`w-full flex justify-content-center text-2xl ${
								flippedIndexes.includes(key) ? 'rotate-180' : ''
							} ${selectedIndexes.includes(key) ? 'bg-green-500' : ''}`}
							size="large"
							onClick={() => handleSelection(key)}
						>
							😂
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
