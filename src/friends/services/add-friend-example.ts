import { supabase } from '../../supabase-client/supabase-client.js';
import { insertFriendship } from './add-friend.ts';
import { acceptFriendRequest } from './accept-friend-request.ts';
import { PENCIL_IT_IN_EMAIL, PENCIL_IT_IN_PASSWORD } from '../../../constants.ts';

// Sign in since most functions require an authorized user
await supabase.auth.signInWithPassword({
  email: PENCIL_IT_IN_EMAIL,
  password: PENCIL_IT_IN_PASSWORD
});

// Prompt user to select an action
const userChoice = prompt(`
Please select a function to run:
1. Add Friendship
2. Accept Friend Request
Enter 1 or 2:
`);

// Handle user input with a switch statement
switch (userChoice) {
  case '1':
    const friendUsername = prompt('Enter the username of the friend to add:');
    if (friendUsername) {
      insertFriendship(friendUsername);
    } else {
      console.error('Invalid input for friend username.');
    }
    break;

  case '2':
    const friendUserId = prompt('Enter the user ID (UUID) of the friend request to accept:');
    if (friendUserId) {
      acceptFriendRequest(friendUserId);
    } else {
      console.error('Invalid input for friend user ID.');
    }
    break;

  default:
    console.error('Invalid choice. Please select 1 or 2.');
}