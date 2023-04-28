import { PropsWithChildren } from 'react';

import { useRoomContext } from '@src/contexts';
import { Loading } from '@src/components/Loading';
import { Error } from '@src/components/Error';

export const RoomHandler = ({ children }: PropsWithChildren) => {
	const { isIdle, isLoading, error, room } = useRoomContext();

	if (error) {
		return <Error />;
	}

	if ([isLoading, isIdle, !room].some((val) => val)) {
		return <Loading message="Loading room" />;
	}

	return <>{children}</>;
};
