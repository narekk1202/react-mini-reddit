import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	type Selection,
} from '@nextui-org/react';
import { useMemo, useState } from 'react';
import { FaFilter } from 'react-icons/fa';

const FilterButton = () => {
	const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['all']));

	const selectedValue = useMemo(
		() => Array.from(selectedKeys).join(', ').replace('_', ' '),
		[selectedKeys]
	);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button className='capitalize'>
					{selectedValue}
					<FaFilter className='size-3' />
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label='Single selection example'
				variant='flat'
				disallowEmptySelection
				selectionMode='single'
				selectedKeys={selectedKeys}
				onSelectionChange={setSelectedKeys}
			>
				<DropdownItem key='all'>All Posts</DropdownItem>
				<DropdownItem key='my posts'>My Posts</DropdownItem>
				<DropdownItem key='likes'>Most liked</DropdownItem>
				<DropdownItem key='dislikes'>Most disliked</DropdownItem>
				<DropdownItem key='comments'>Most commented</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default FilterButton;
