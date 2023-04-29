import { SupabaseClient } from '@supabase/supabase-js';
import { type RoomGame, UpdateSubscriptionPayload, RoomGameStatus } from '@src/types';

export class RoomGameHelper {
	private supabase: SupabaseClient;
	private roomId: string;

	constructor(supabase: SupabaseClient, roomId: string) {
		this.roomId = roomId;
		this.supabase = supabase;
	}

	static fromRoomId(supabase: SupabaseClient, roomId: string) {
		return new RoomGameHelper(supabase, roomId);
	}

	async getGame() {
		const { data } = await this.supabase
			.from('room_games')
			.select('id, status, flippedItems:flipped_items')
			.eq('status', RoomGameStatus.CREATED)
			.eq('room_id', this.roomId)
			.limit(1)
			.single()
			.throwOnError();

		return data as RoomGame;
	}

	getUpdateSubscription(callback: (payload: UpdateSubscriptionPayload) => void) {
		return this.supabase
			.channel('new-game')
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'room_games',
					filter: `room_id=eq.${this.roomId}`,
				},
				callback
			)
			.subscribe();
	}
}
