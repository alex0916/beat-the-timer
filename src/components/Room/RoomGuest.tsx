import { Chip } from 'primereact/chip';

import { useGetRoomPlayers } from '@src/hooks';

export const RoomGuest = () => {
	const { data: players, isLoading, error } = useGetRoomPlayers();

	if (error) {
		return <>Error!</>;
	}

	return (
		<div className="grid">
			<div className="col-12">
				<h1 className="text-center">Wait... 🎲</h1>
			</div>

			{isLoading ? (
				<div className="col-12 px-0">
					<div className="m-0 p-0">Loading players...</div>
				</div>
			) : (
				<div className="col-12">
					<div className="flex flex-row flex-wrap gap-2">
						{players.map(({ id, name }: any) => (
							<Chip key={id} label={name} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};
