import { useRouter } from 'next/router';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useQuery } from 'react-query';

import { useRoomHelper } from '@src/hooks';
import { RoomStatus, type Room } from '@src/types';

export type RoomContextState = {
	room: Room;
	error: unknown;
	isLoading: boolean;
};

const RoomContext = createContext<RoomContextState>({} as RoomContextState);

export const RoomContextProvider = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const { query } = router;
	const roomHelper = useRoomHelper();
	const [room, setRoom] = useState<Room>();

	const handleSetRoom = useCallback(
		(newRoom: Partial<Room>) => {
			let redirectPath = null;
			if (newRoom.status === RoomStatus.STARTED && !router.pathname.includes('game')) {
				redirectPath = `/room/${query.roomId}/player/${query.playerId}/game`;
			}

			if (newRoom.status === RoomStatus.FINISHED && !router.pathname.includes('scores')) {
				redirectPath = `/room/${query.roomId}/scores`;
			}

			if (redirectPath) {
				router.push(redirectPath).then(() => {
					setRoom((prevRoom) => ({ ...prevRoom, ...newRoom } as Room));
				});
			} else {
				setRoom((prevRoom) => ({ ...prevRoom, ...newRoom } as Room));
			}
		},
		[query, router]
	);

	const { isLoading, error } = useQuery(
		['room', roomHelper?.query],
		async () => {
			return await roomHelper.getRoom();
		},
		{
			enabled: !!roomHelper,
			onSuccess(data) {
				handleSetRoom(data);
			},
		}
	);

	useEffect(() => {
		if (!roomHelper) {
			return;
		}

		const roomUpdateSubscription = roomHelper.getUpdateSubscription((payload) => {
			const { status } = payload.new;
			handleSetRoom({ status });
		});

		return () => {
			roomUpdateSubscription.unsubscribe();
		};
	}, [roomHelper, handleSetRoom]);

	return (
		<RoomContext.Provider value={{ room: room as Room, error, isLoading }}>
			{children}
		</RoomContext.Provider>
	);
};

export const useRoomContext = () => useContext(RoomContext);
