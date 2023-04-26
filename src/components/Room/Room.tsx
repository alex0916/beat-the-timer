import { useRoomContext } from '@src/contexts';
import { RoomOwner, RoomGuest } from '@src/components/Room';

export const Room = () => {
	const { room } = useRoomContext();

	if (room?.player?.isOwner) {
		return <RoomOwner />;
	}

	return <RoomGuest />;
};
