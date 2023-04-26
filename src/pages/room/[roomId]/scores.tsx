import { Layout } from '@src/components/Layout';
import { RoomHandler, RoomScores } from '@src/components/Room';

export default function RoomScoresPage() {
	return (
		<Layout>
			<RoomHandler>
				<RoomScores />
			</RoomHandler>
		</Layout>
	);
}
