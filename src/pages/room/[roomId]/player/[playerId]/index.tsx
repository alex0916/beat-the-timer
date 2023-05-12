import { useRoomContext } from '@src/contexts';

import RoomOwner from '@src/components/Room/RoomOwner';
import RoomGuest from '@src/components/Room/RoomGuest';

export default function Room() {
	const { room } = useRoomContext();

	if (room?.player?.isOwner) {
		return <RoomOwner />;
	}

	return <RoomGuest />;
}
