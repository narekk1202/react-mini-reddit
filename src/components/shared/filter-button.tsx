import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	SharedSelection,
	type Selection,
} from '@nextui-org/react';
import { FC } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterKeys from '../../constants/FilterKeys';

interface Props {
	selectedValue: string;
	selectedKeys: Selection;
	setSelectedKeys: (keys: SharedSelection) => void;
}

const FilterButton: FC<Props> = ({
	selectedKeys,
	setSelectedKeys,
	selectedValue,
}) => {
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
				<DropdownItem key={FilterKeys.all}>All Posts</DropdownItem>
				<DropdownItem key={FilterKeys.myPosts}>My Posts</DropdownItem>
				{/* <DropdownItem key={FilterKeys.likes}>Most liked</DropdownItem> */}
				{/* <DropdownItem key={FilterKeys.dislikes}>Most disliked</DropdownItem> */}
				{/* <DropdownItem key={FilterKeys.comments}>Most commented</DropdownItem> */}
			</DropdownMenu>
		</Dropdown>
	);
};

export default FilterButton;
