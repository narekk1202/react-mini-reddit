import { Button } from '@nextui-org/button';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/react';
import { FC } from 'react';

interface Props {
	body: string;
	title: string;
	isOpen: boolean;
	loading?: boolean;
	buttonValue: string;
	onClick: () => void;
	onOpenChange: (isOpen: boolean) => void;
}

const YouSureModal: FC<Props> = ({
	isOpen,
	title,
	body,
	buttonValue,
	loading,
	onClick,
	onOpenChange,
}) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='flex flex-col gap-1'>{title}</ModalHeader>
						<ModalBody>
							<span>{body}</span>
						</ModalBody>
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onClose}>
								Close
							</Button>
							<Button isLoading={loading} onClick={onClick} color='primary'>
								{buttonValue}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default YouSureModal;
