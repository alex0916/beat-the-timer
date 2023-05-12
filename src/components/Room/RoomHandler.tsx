import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

import Error from '@src/components/Error';
import Loading from '@src/components/Loading';
import { useRoomContext } from '@src/contexts';

export default function RoomHandler({ children }: PropsWithChildren) {
	const router = useRouter();
	const { isLoading, error, room } = useRoomContext();
	const shouldWaitForRoom = router.pathname.includes('roomId') && !room;

	if (error) {
		return <Error />;
	}

	if (isLoading || shouldWaitForRoom) {
		return <Loading message="Loading room" />;
	}

	return <>{children}</>;
}
