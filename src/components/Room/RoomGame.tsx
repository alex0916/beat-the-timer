import { useGetRoomGame } from '@src/hooks';
import { Loading } from '../Loading';
import { BeatTimer } from '../Games';

export const RoomGame = () => {
	const {
		error,
		isLoading,
		isIdle,
		data: roomGame,
		isScoreLoading,
		isReadyForNextGame,
		handleScore,
	} = useGetRoomGame();

	if (error) {
		return <>Error!</>;
	}

	if (isLoading || isIdle) {
		return <Loading />;
	}

	if (isScoreLoading) {
		return <Loading />;
	}

	if (isReadyForNextGame) {
		return <>Score Saved, wait for the others</>;
	}

	return <BeatTimer flippedItems={roomGame?.flippedItems} handleScore={handleScore} />;
};
