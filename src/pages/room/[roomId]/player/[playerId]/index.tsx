import { Layout } from '@src/components/Layout';
import { RoomHandler, Room } from '@src/components/Room';

export default function RoomPage() {
	return (
		<Layout>
			<RoomHandler>
				<Room />
			</RoomHandler>
		</Layout>
	);
}
