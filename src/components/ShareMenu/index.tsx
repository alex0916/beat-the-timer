import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { MenuItem } from 'primereact/menuitem';
import { Dialog } from 'primereact/dialog';

import { useRoomContext } from '@src/contexts';

export const ShareMenu = () => {
	const { room } = useRoomContext();
	const menu = useRef<Menu>(null);
	const toast = useRef<Toast>(null);
	const [isDialogVisible, setIsDialogVisible] = useState(false);

	const items: MenuItem[] = [
		{
			label: 'Copy link',
			command: () => {
				navigator.clipboard.writeText(`${window.location.origin}/room/${room.id}/join`).then(() => {
					toast?.current?.show?.({ severity: 'success', detail: 'Copied!', life: 2000 });
				});
			},
		},
		{
			label: 'Show QR Code',
			command: () => {
				setIsDialogVisible(true);
			},
		},
	];

	return (
		<>
			<Toast ref={toast} position="bottom-center" />
			<Dialog
				header="Scan QR Code"
				visible={isDialogVisible}
				onHide={() => setIsDialogVisible(false)}
				style={{ width: '50vw' }}
				breakpoints={{ '960px': '75vw', '641px': '100vw' }}
			>
				<QRCode
					style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
					value={`${window.location.origin}/room/${room.id}/join`}
				/>
			</Dialog>
			<Menu model={items} popup ref={menu} />
			<Button
				text
				label="Share invite link"
				icon="pi pi-bars"
				onClick={(e) => menu?.current?.toggle?.(e)}
			/>
		</>
	);
};
