import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Role } from '$lib/stores/auth';

// Demo mode: Map tokens to user data
// In production, this would validate against a real database/JWT
const tokenToUserMap = new Map<string, any>();

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const token = authHeader.replace('Bearer ', '');

	// Check if token exists in our demo store
	const userData = tokenToUserMap.get(token);

	if (userData) {
		return json(userData);
	}

	// For demo mode: Parse demo token and recreate user
	// Demo tokens have format: demo-token-{timestamp}
	if (token.startsWith('demo-token-')) {
		// Since we're in demo mode and tokens are stored in localStorage,
		// we need to reconstruct the user from the token
		// In a real app, the token would contain the user info (JWT)

		// For now, return a default demo user
		// This is a fallback - ideally the token should encode user info
		const demoUser = {
			id: 'demo-user-001',
			email: 'admin@dyinnovate.com',
			name: 'DY Admin',
			role: Role.SUPER_ADMIN,
			permissions: ['*']
		};

		// Store for next time
		tokenToUserMap.set(token, demoUser);

		return json(demoUser);
	}

	return json({ error: 'Invalid token' }, { status: 401 });
};

// Helper endpoint to store token-user mapping (called during login)
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { token, user } = await request.json();

		if (!token || !user) {
			return json({ error: 'Missing token or user data' }, { status: 400 });
		}

		tokenToUserMap.set(token, user);

		return json({ success: true });
	} catch (error) {
		return json({ error: 'Invalid request' }, { status: 400 });
	}
};
