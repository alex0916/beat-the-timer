import { useRoomContext } from '@src/contexts';
import { RoomOwner, RoomGuest } from '@src/components';

export const Room = () => {
	const { room } = useRoomContext();

	if (room?.player?.isOwner) {
		return <RoomOwner />;
	}

	return <RoomGuest />;
};
