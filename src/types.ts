import {
	RealtimePostgresInsertPayload,
	RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js';

export type UpdateSubscriptionPayload = RealtimePostgresUpdatePayload<{ [key: string]: any }>;
export type InsertSubscriptionPayload = RealtimePostgresInsertPayload<{ [key: string]: any }>;

export type Room = {
	id: string;
	name: string;
	status: number;
	rounds: number;
	roundsPlayed: number;
	player?: {
		id: string;
		name: string;
		isOwner: boolean;
	};
};

export type RoomPlayer = {
	id: string;
	name: string;
};

export type RoomGame = {
	id: string;
	status: number;
	flippedItems: number;
	scores: {
		id: string;
		playerId: string;
		score: number;
	}[];
};
