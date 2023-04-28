import { useGetRoomGame } from '@src/hooks';
import { Loading } from '@src/components/Loading';
import { BeatTimer } from '@src/components/Games';
import { Error } from '@src/components/Error';

export const RoomGame = () => {
	const {
		error,
		isLoading,
		isIdle,
		isRefetching,
		data: roomGame,
		isScoreLoading,
		isReadyForNextGame,
		handleScore,
		scoreError,
	} = useGetRoomGame();

	if (error || scoreError) {
		return <Error />;
	}

	if ([isLoading, isIdle, isRefetching].some(val => val)) {
		return <Loading message="Loading Game" />;
	}

	if (isScoreLoading || isReadyForNextGame) {
		return <Loading message="Saving Score" />;
	}

	return <BeatTimer flippedItems={roomGame?.flippedItems} handleScore={handleScore} />;
};
