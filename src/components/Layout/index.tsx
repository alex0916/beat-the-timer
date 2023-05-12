import { PropsWithChildren } from 'react';
import { useWindowSize } from '@src/hooks';

export default function Layout({ children }: PropsWithChildren) {
	const { height } = useWindowSize();

	if (!height) {
		return null;
	}

	return (
		<div style={{ height }} className="grid align-content-center">
			<div className="col-10 col-offset-1 lg:col-4 lg:col-offset-4">{children}</div>
		</div>
	);
}
