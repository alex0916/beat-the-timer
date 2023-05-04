import {
	RealtimePostgresInsertPayload,
	RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js';

export type UpdateSubscriptionPayload = RealtimePostgresUpdatePayload<{ [key: string]: any }>;
export type InsertSubscriptionPayload = RealtimePostgresInsertPayload<{ [key: string]: any }>;

export enum RoomStatus {
	CREATED = 1,
	STARTED,
	FINISHED,
}

export enum RoomGameStatus {
	CREATED = 1,
	FINISHED,
}

export type Room = {
	id: string;
	name: string;
	status: number;
	rounds: number;
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
	isLastGame: boolean;
};
