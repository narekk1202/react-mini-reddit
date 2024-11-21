import { Tables } from '../../database.types';

export interface IPost extends Tables<'posts_with_comments_count'> {
	user: Tables<'profiles'>;
}
