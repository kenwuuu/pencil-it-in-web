import {supabase} from '../../supabase-client/supabase-client.js';

/**
 * Logs in with email & password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object | null, session: object | null, error: object | null }>}
 */
export async function loginWithEmailPassword(email, password) {
    const {
        data: {user, session},
        error,
    } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return {user, session, error};
}
