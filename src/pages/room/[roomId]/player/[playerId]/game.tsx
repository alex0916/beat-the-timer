import { Layout } from '@src/components/Layout';
import { RoomGame, RoomHandler } from '@src/components/Room';

export default function RoomGamePage() {
	return (
		<Layout>
			<RoomHandler>
				<RoomGame />
			</RoomHandler>
		</Layout>
	);
}
