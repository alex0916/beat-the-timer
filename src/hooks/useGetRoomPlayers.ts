import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { useRoomPlayersHelper } from '@src/hooks';
import { type RoomPlayer } from '@src/types';

export const useGetRoomPlayers = () => {
	const roomPlayersHelper = useRoomPlayersHelper();
	const [players, setPlayers] = useState<RoomPlayer[]>([]);

	const { isLoading, error } = useQuery(
		['room-players'],
		async () => {
			return await roomPlayersHelper.getPlayers();
		},
		{
			enabled: !!roomPlayersHelper,
			onSuccess(data) {
				setPlayers(data);
			},
		}
	);

	useEffect(() => {
		if (!roomPlayersHelper) {
			return;
		}

		const newPlayerSubscription = roomPlayersHelper.getNewPlayerSubscription((payload) => {
			const { id, player_name: name } = payload.new;
			setPlayers((prevPlayers) => [...prevPlayers, { id, name }]);
		});

		return () => {
			newPlayerSubscription.unsubscribe();
		};
	}, [roomPlayersHelper]);

	return { isLoading, error, data: players };
};
