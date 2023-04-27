import { useGetRoomGame } from '@src/hooks';
import { Loading } from '@src/components/Loading';
import { BeatTimer } from '@src/components/Games';
import { Error } from '@src/components/Error';

export const RoomGame = () => {
	const {
		error,
		isLoading,
		isIdle,
		data: roomGame,
		isScoreLoading,
		isReadyForNextGame,
		handleScore,
		scoreError,
	} = useGetRoomGame();

	if (error || scoreError) {
		return <Error />;
	}

	if (isLoading || isIdle) {
		return <Loading />;
	}

	if (isScoreLoading || isReadyForNextGame) {
		return <Loading />;
	}

	return <BeatTimer flippedItems={roomGame?.flippedItems} handleScore={handleScore} />;
};
