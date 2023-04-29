import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { useRoomContext } from '@src/contexts';
import { SaveScoreHelper } from '@src/lib';
import { useActionHelper, useRoomGameHelper } from '@src/hooks';
import { RoomGame, RoomGameStatus } from '@src/types';

export const useGetRoomGame = () => {
	const { room } = useRoomContext();
	const saveScoreHelper = useActionHelper(SaveScoreHelper);
	const roomGameHelper = useRoomGameHelper();
	const [roomGame, setRoomGame] = useState<RoomGame>();
	const [isLastRound, setIsLastRound] = useState(false);

	const { isLoading, isRefetching, isIdle, error, refetch } = useQuery(
		['room-game'],
		async () => {
			return await roomGameHelper.getGame();
		},
		{
			enabled: !!roomGameHelper,
			onSuccess(data) {
				setRoomGame(data);
			},
		}
	);

	const scoreMutation = useMutation({
		mutationFn: async (score: number) => {
			return saveScoreHelper.saveScore({
				score,
				roomGameId: roomGame!.id,
				playerId: room.player!.id,
			});
		},
	});

	useEffect(() => {
		if (!roomGameHelper) {
			return;
		}

		const roomGameUpdateSubscription = roomGameHelper.getUpdateSubscription((payload) => {
			const { status } = payload.new;
			setRoomGame((prev) => ({ ...prev, status } as RoomGame));
		});
		return () => {
			roomGameUpdateSubscription.unsubscribe();
		};
	}, [roomGameHelper]);

	useEffect(() => {
		if (roomGame?.status === RoomGameStatus.FINISHED && !isLastRound) {
			setIsLastRound(room.rounds - room.roundsPlayed === 1);
			refetch();
			scoreMutation.reset();
		}
	}, [room, roomGame, isLastRound, scoreMutation, refetch]);

	return {
		isLoading,
		isRefetching,
		isIdle,
		data: roomGame,
		error: error,
		scoreMutation,
		isLastRound,
	};
};
