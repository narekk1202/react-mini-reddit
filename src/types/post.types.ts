import { Tables } from '../../database.types';

export interface IPost extends Tables<'posts'> {
	user: Tables<'profiles'>;
}
