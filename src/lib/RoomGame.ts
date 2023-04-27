import { SupabaseClient } from '@supabase/supabase-js';
import { type RoomGame, UpdateSubscriptionPayload, RoomGameStatus } from '@src/types';

export class RoomGameHelper {
	private supabase: SupabaseClient;
	private roomId: string;
	private roomGameId: string | null;

	constructor(supabase: SupabaseClient, roomId: string) {
		this.roomId = roomId;
		this.supabase = supabase;
		this.roomGameId = null;
	}

	static fromRoomId(supabase: SupabaseClient, roomId: string) {
		return new RoomGameHelper(supabase, roomId);
	}

	async getGame() {
		const { data } = await this.supabase
			.from('room_games')
			.select(
				'id, status, flippedItems:flipped_items, scores:room_scores(id, playerId: player_id, score)'
			)
			.eq('status', RoomGameStatus.CREATED)
			.eq('room_id', this.roomId)
			.limit(1)
			.single()
			.throwOnError();

		this.roomGameId = data?.id;
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
					filter: `id=eq.${this.roomGameId}`,
				},
				callback
			)
			.subscribe();
	}
}
