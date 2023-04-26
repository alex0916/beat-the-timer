import { PropsWithChildren } from 'react';

import { useRoomContext } from '@src/contexts';
import { Loading } from '@src/components/Loading';

export const RoomHandler = ({ children }: PropsWithChildren) => {
	const { error, isIdle, isLoading } = useRoomContext();

	if (error) {
		return <>Error!</>;
	}

	if (isLoading || isIdle) {
		return <Loading />;
	}

	return <>{children}</>;
};
