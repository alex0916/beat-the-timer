import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';

import { useRoomContext } from '@src/contexts';
import { SaveScoreHelper } from '@src/lib';
import { useActionHelper, useRoomGameHelper } from '@src/hooks';
import { type RoomGame } from '@src/types';

export const useGetRoomGame = () => {
	const { room } = useRoomContext();
	const saveScoreHelper = useActionHelper(SaveScoreHelper);
	const roomGameHelper = useRoomGameHelper();
	const [roomGame, setRoomGame] = useState<RoomGame>();

	const { isLoading, isIdle, error, refetch } = useQuery(
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
				playerId: room!.player!.id,
			});
		},
	});

	const isReadyForNextGame = useMemo(
		() => roomGame?.scores?.find?.((score) => score.playerId === room?.player?.id) !== undefined,
		[roomGame?.scores, room?.player?.id]
	);

	useEffect(() => {
		if (!roomGame || !room) {
			return;
		}

		if (roomGame.status === 2 && room.rounds !== room.roundsPlayed) {
			refetch();
			scoreMutation.reset();
		}

		const roomGameUpdateSubscription = roomGameHelper.getUpdateSubscription((payload) => {
			const { status } = payload.new;
			setRoomGame((prevRoomGame) => ({ ...prevRoomGame, status } as RoomGame));
		});

		return () => {
			roomGameUpdateSubscription.unsubscribe();
		};
	}, [roomGame]);

	return {
		isLoading,
		isIdle,
		data: roomGame,
		error: error,
		handleScore: scoreMutation.mutate,
		isScoreLoading: scoreMutation.isLoading,
		isReadyForNextGame: isReadyForNextGame || scoreMutation.isSuccess,
	};
};
