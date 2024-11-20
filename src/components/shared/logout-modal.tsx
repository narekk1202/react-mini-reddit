import { Button } from '@nextui-org/button';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/react';
import { FC } from 'react';
import { useAuth } from '../../providers/auth-provider';

interface Props {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

const LogoutModal: FC<Props> = ({ isOpen, onOpenChange }) => {
	const { signOut } = useAuth();

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='flex flex-col gap-1'>Sign Out</ModalHeader>
						<ModalBody>
							<span>Are you sure you want to sign out?</span>
						</ModalBody>
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onClose}>
								Close
							</Button>
							<Button onClick={signOut} color='primary'>
								Sign Out
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default LogoutModal;
