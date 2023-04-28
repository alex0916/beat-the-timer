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
		scoreMutation,
		isLastRound,
	} = useGetRoomGame();

	if (error || scoreMutation.error) {
		return <Error />;
	}

	if ([isLoading, isIdle, isRefetching].some((val) => val)) {
		return <Loading message="Loading game" />;
	}

	if (scoreMutation.isLoading) {
		return <Loading message="Saving score" />;
	}

	if (scoreMutation.isSuccess) {
		const messsage = `Score saved, wait for the ${isLastRound ? 'results' : 'next game'}`;
		return <Loading message={messsage} />;
	}

	return <BeatTimer flippedItems={roomGame?.flippedItems} handleScore={scoreMutation.mutate} />;
};
