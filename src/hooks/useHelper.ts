import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SupabaseClient, useSupabaseClient } from '@supabase/auth-helpers-react';

import { useRoomContext } from '@src/contexts';
import { RoomHelper, RoomGameHelper, RoomPlayersHelper, ScoresHelper } from '@src/lib';

export const useRoomHelper = () => {
	const router = useRouter();
	const { query } = router;
	const supabase = useSupabaseClient();
	const [room, setRoom] = useState<RoomHelper>();

	useEffect(() => {
		if (query.roomId) {
			setRoom(RoomHelper.fromParsedUrlQuery(supabase, query));
		}
	}, [query, supabase]);

	return room as RoomHelper;
};

export const useRoomGameHelper = () => {
	const supabase = useSupabaseClient();
	const { room } = useRoomContext();
	const [roomGame, setRoomGame] = useState<RoomGameHelper>();

	useEffect(() => {
		setRoomGame(RoomGameHelper.fromRoomId(supabase, room.id));
	}, [room.id, supabase]);

	return roomGame as RoomGameHelper;
};

export const useRoomPlayersHelper = () => {
	const supabase = useSupabaseClient();
	const { room } = useRoomContext();
	const [roomPlayers, setRoomPlayers] = useState<RoomPlayersHelper>();

	useEffect(() => {
		setRoomPlayers(RoomPlayersHelper.fromRoomId(supabase, room.id));
	}, [room.id, supabase]);

	return roomPlayers as RoomPlayersHelper;
};

export const useScoresHelper = () => {
	const supabase = useSupabaseClient();
	const { room } = useRoomContext();
	const [scores, setScores] = useState<ScoresHelper>();

	useEffect(() => {
		setScores(ScoresHelper.fromRoomId(supabase, room.id));
	}, [room.id, supabase]);

	return scores as ScoresHelper;
};

export const useActionHelper = <T>(Helper: new (supabase: SupabaseClient) => T) => {
	const supabase = useSupabaseClient();
	const [actionHelper, setActionHelper] = useState<T>();

	useEffect(() => {
		setActionHelper(new Helper(supabase));
	}, [Helper, supabase]);

	return actionHelper as T;
};
