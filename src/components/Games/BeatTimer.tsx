import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { getRandomNumber } from '@src/utils';

const GRID_SIZE = 24;

type BeatTimerProps = {
	flippedItems: number | undefined;
	handleScore: (score: number) => void;
};

// @TODO improve
const getFlippedIndexes = (flippedItems: number) =>
	new Set(
		[...Array(GRID_SIZE).keys()].map(() => getRandomNumber(GRID_SIZE)).slice(0, flippedItems)
	);

export const BeatTimer = ({ flippedItems = 1, handleScore }: BeatTimerProps) => {
	const [flippedIndexes, setFlippedIndexes] = useState<Set<number>>(new Set([]));
	const [selectedIndexes, setSelectedIndexes] = useState<Set<number>>(new Set([]));

	useEffect(() => {
		setFlippedIndexes(getFlippedIndexes(flippedItems));
	}, [flippedItems]);

	useEffect(() => {
		if (selectedIndexes.size === flippedItems) {
			handleScore(10);
		}
	}, [selectedIndexes]);

	const handleSelection = (selectedItem: number) => {
		if (flippedIndexes.has(selectedItem)) {
			setSelectedIndexes((prevSelected) => new Set([...prevSelected, selectedItem]));
		}
	};

	console.log({ flippedIndexes, flippedItems });

	return (
		<div className="grid pt-5">
			<div className="grid">
				{[...Array(GRID_SIZE).keys()].map((_value, idx) => (
					<div className="col-2" key={`item-${idx}`}>
						<Button
							text
							className={`w-full flex justify-content-center text-2xl ${
								flippedIndexes.has(idx) ? 'rotate-180' : ''
							} ${selectedIndexes.has(idx) ? 'bg-green-500' : ''}`}
							size="large"
							onClick={() => handleSelection(idx)}
						>
							😂
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};
