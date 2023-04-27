import { PropsWithChildren } from 'react';

import { useRoomContext } from '@src/contexts';
import { Loading } from '@src/components/Loading';
import { Error } from '@src/components/Error';

export const RoomHandler = ({ children }: PropsWithChildren) => {
	const { isIdle, isLoading, error } = useRoomContext();

	if (isLoading || isIdle) {
		return <Loading />;
	}

	if (error) {
		return <Error />;
	}

	return <>{children}</>;
};
