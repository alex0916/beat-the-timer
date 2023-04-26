import { SupabaseClient } from '@supabase/supabase-js';

type JoinRoomInput = {
	playerName: string;
	roomId: string;
};

export class JoinRoomHelper {
	private supabase: SupabaseClient;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	async joinRoom(input: JoinRoomInput) {
		const { data } = await this.supabase
			.from('room_players')
			.insert({ player_name: input.playerName, room_id: input.roomId })
			.select()
			.single()
			.throwOnError();

		return { playerId: data?.id };
	}
}
