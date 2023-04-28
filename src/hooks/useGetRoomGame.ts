import { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';

import { useRoomContext } from '@src/contexts';
import { SaveScoreHelper } from '@src/lib';
import { useActionHelper, useRoomGameHelper } from '@src/hooks';

export const useGetRoomGame = () => {
	const { room } = useRoomContext();
	const saveScoreHelper = useActionHelper(SaveScoreHelper);
	const roomGameHelper = useRoomGameHelper();

	const {
		isLoading,
		isRefetching,
		isIdle,
		data: roomGame,
		error,
		refetch,
	} = useQuery(
		['room-game'],
		async () => {
			return await roomGameHelper.getGame();
		},
		{
			enabled: !!roomGameHelper,
		}
	);

	const scoreMutation = useMutation({
		mutationFn: async (score: number) => {
			return saveScoreHelper.saveScore({
				score,
				roomGameId: roomGame!.id,
				playerId: room!.player!.id,
			});
		},
	});

	const isLastRound = room!.rounds - room!.roundsPlayed === 1;

	useEffect(() => {
		if (!roomGame || !roomGameHelper) {
			return;
		}

		const roomGameUpdateSubscription = roomGameHelper.getUpdateSubscription((payload) => {
			const { status } = payload.new;
			if (status === 2 && !isLastRound) {
				refetch();
				scoreMutation.reset();
			}
		});

		return () => {
			roomGameUpdateSubscription.unsubscribe();
		};
	}, [roomGame, roomGameHelper]);

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
