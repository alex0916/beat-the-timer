import { SupabaseClient } from '@supabase/supabase-js';
import { type InsertSubscriptionPayload, type RoomPlayer } from '@src/types';

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

	getNewPlayerSubscription(callback: (payload: InsertSubscriptionPayload) => void) {
		return this.supabase
			.channel('new-game')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'room_players',
					filter: `room_id=eq.${this.roomId}`,
				},
				callback
			)
			.subscribe();
	}
}
