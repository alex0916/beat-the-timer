import { SupabaseClient } from '@supabase/supabase-js';
import { type RoomPlayer } from '@src/types';

export class RoomPlayersHelper {
	private supabase: SupabaseClient;
	private roomId: string;

	constructor(supabase: SupabaseClient, roomId: string) {
		this.supabase = supabase;
		this.roomId = roomId;
	}

	static fromRoomId(supabase: SupabaseClient, roomId: string) {
		return new RoomPlayersHelper(supabase, roomId);
	}

	async getPlayers() {
		const { data } = await this.supabase
			.from('room_players')
			.select('id, name:player_name')
			.eq('room_id', this.roomId)
			.throwOnError();

		return data as RoomPlayer[];
	}
}
