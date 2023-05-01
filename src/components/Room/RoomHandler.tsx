import { PropsWithChildren } from 'react';

import { useRoomContext } from '@src/contexts';
import { Loading } from '@src/components/Loading';
import { Error } from '@src/components/Error';
import { useRouter } from 'next/router';

export const RoomHandler = ({ children }: PropsWithChildren) => {
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
};
