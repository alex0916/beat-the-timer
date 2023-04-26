import { ParsedUrlQuery } from 'querystring';
import { SupabaseClient } from '@supabase/supabase-js';

import { type Room, UpdateSubscriptionPayload } from '@src/types';

export class RoomHelper {
	private supabase: SupabaseClient;
	query: ParsedUrlQuery;

	constructor(supabase: SupabaseClient, query: ParsedUrlQuery) {
		this.supabase = supabase;
		this.query = query;
	}

	static fromParsedUrlQuery(supabase: SupabaseClient, query: ParsedUrlQuery) {
		return new RoomHelper(supabase, query);
	}

	private async getRoomQuery() {
		const { playerId, roomId } = this.query;
		if (!playerId) {
			return this.supabase
				.from('rooms')
				.select('id, name, status, rounds, roundsPlayed: rounds_played')
				.eq('id', roomId)
				.single();
		}

		return this.supabase
			.from('room_players')
			.select(
				'id, name: player_name, isOwner:is_owner, room:rooms(id, name, status, rounds, roundsPlayed: rounds_played)'
			)
			.eq('rooms.id', roomId)
			.eq('id', playerId)
			.single();
	}

	async getRoom() {
		const { data, error } = await this.getRoomQuery();

		if (error) {
			throw error;
		}

		if ('room' in data) {
			const { room, ...player } = data;
			return { ...room, player } as Room;
		}

		return data as Room;
	}

	getUpdateSubscription(callback: (payload: UpdateSubscriptionPayload) => void) {
		return this.supabase
			.channel('update-room')
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${this.query.roomId}` },
				callback
			)
			.subscribe();
	}
}
