import { useRouter } from 'next/router';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { useRoomHelper } from '@src/hooks';
import { type Room } from '@src/types';

export type RoomContextState = {
	room: Room | undefined;
	error: any;
	isLoading: boolean;
	isIdle: boolean;
};

const RoomContext = createContext<RoomContextState>({} as RoomContextState);

export const RoomContextProvider = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const { query } = router;
	const roomHelper = useRoomHelper();
	const [room, setRoom] = useState<Room>();

	const { isLoading, isIdle, error } = useQuery(
		['room', roomHelper?.query],
		async () => {
			return await roomHelper.getRoom();
		},
		{
			enabled: !!roomHelper,
			onSuccess(data) {
				setRoom(data);
			},
		}
	);

	useEffect(() => {
		if (!room) {
			return;
		}

		if (room.status === 2) {
			router.push(`/room/${query.roomId}/player/${query.playerId}/game`);
		}

		if (room.rounds === room.roundsPlayed) {
			router.push(`/room/${query.roomId}/scores`);
		}

		const roomUpdateSubscription = roomHelper.getUpdateSubscription((payload) => {
			const { rounds, rounds_played: roundsPlayed, status } = payload.new;
			setRoom((prevRoom) => ({ ...prevRoom, rounds, roundsPlayed, status } as Room));
		});

		return () => {
			roomUpdateSubscription.unsubscribe();
		};
	}, [room]);

	return (
		<RoomContext.Provider value={{ room, error, isLoading, isIdle }}>
			{children}
		</RoomContext.Provider>
	);
};

export const useRoomContext = () => useContext(RoomContext);
