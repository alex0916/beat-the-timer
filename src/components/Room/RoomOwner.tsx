import { useMutation } from 'react-query';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';

import { useRoomContext } from '@src/contexts';
import { StartGameHelper } from '@src/lib';
import { useActionHelper, useGetRoomPlayers } from '@src/hooks';
import ShareMenu from '@src/components/ShareMenu';

export default function RoomOwner() {
	const { room } = useRoomContext();
	const players = useGetRoomPlayers();
	const startGameHelper = useActionHelper(StartGameHelper);

	const { isLoading, mutate } = useMutation({
		mutationFn: async () => {
			return await startGameHelper.startGame({ roomId: room.id });
		},
	});

	return (
		<div className="grid">
			<div className="col-12">
				<h1 className="text-center">Share the invite link and start the game 🎲</h1>
			</div>

			<div className="col-12 flex justify-content-center align-items-center mb-2">
				<ShareMenu />
			</div>

			{players.isLoading ? (
				<div className="col-12 px-0">
					<div className="m-0 p-0">Loading players...</div>
				</div>
			) : (
				<div className="col-12">
					<div className="flex flex-row flex-wrap gap-2">
						{players.data.map(({ id, name }) => (
							<Chip key={id} label={name} />
						))}
					</div>
				</div>
			)}

			<div className="col-12 pt-4">
				<Button
					size="large"
					loading={isLoading}
					className="w-full"
					onClick={() => mutate()}
					label="Start Game"
					disabled={!players || players.data.length < 2}
				/>
			</div>
		</div>
	);
}
