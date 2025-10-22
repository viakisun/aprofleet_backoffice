import { writable } from 'svelte/store';
import { nanoid } from 'nanoid';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
	id: string;
	type: NotificationType;
	title: string;
	message?: string;
	duration?: number;
	timestamp: string;
	persistent?: boolean;
	action?: {
		label: string;
		handler: () => void;
	};
}

interface NotificationState {
	notifications: Notification[];
	history: Notification[];
}

const DEFAULT_DURATION = 5000;

function createNotificationStore() {
	const { subscribe, set, update } = writable<NotificationState>({
		notifications: [],
		history: []
	});

	function add(notification: Omit<Notification, 'id' | 'timestamp'>) {
		const newNotification: Notification = {
			...notification,
			id: nanoid(),
			timestamp: new Date().toISOString(),
			duration: notification.duration ?? DEFAULT_DURATION
		};

		update(state => ({
			notifications: [...state.notifications, newNotification],
			history: [newNotification, ...state.history].slice(0, 50) // Keep last 50
		}));

		// Auto-remove non-persistent notifications
		if (!newNotification.persistent && newNotification.duration) {
			setTimeout(() => {
				remove(newNotification.id);
			}, newNotification.duration);
		}

		return newNotification.id;
	}

	function remove(id: string) {
		update(state => ({
			...state,
			notifications: state.notifications.filter(n => n.id !== id)
		}));
	}

	function clear() {
		update(state => ({
			...state,
			notifications: []
		}));
	}

	function clearHistory() {
		update(state => ({
			...state,
			history: []
		}));
	}

	// Convenience methods
	function info(title: string, message?: string, options?: Partial<Notification>) {
		return add({ ...options, type: 'info', title, message });
	}

	function success(title: string, message?: string, options?: Partial<Notification>) {
		return add({ ...options, type: 'success', title, message });
	}

	function warning(title: string, message?: string, options?: Partial<Notification>) {
		return add({ ...options, type: 'warning', title, message });
	}

	function error(title: string, message?: string, options?: Partial<Notification>) {
		return add({ ...options, type: 'error', title, message });
	}

	// System notification for critical alerts
	function systemAlert(alert: {
		vehicleId?: string;
		type: 'warning' | 'error';
		message: string;
		actionLabel?: string;
		actionHandler?: () => void;
	}) {
		const notification: Omit<Notification, 'id' | 'timestamp'> = {
			type: alert.type,
			title: alert.vehicleId ? `VEHICLE ${alert.vehicleId}` : 'SYSTEM ALERT',
			message: alert.message,
			persistent: alert.type === 'error',
			duration: alert.type === 'error' ? undefined : 10000
		};

		if (alert.actionLabel && alert.actionHandler) {
			notification.action = {
				label: alert.actionLabel,
				handler: alert.actionHandler
			};
		}

		return add(notification);
	}

	return {
		subscribe,
		add,
		remove,
		clear,
		clearHistory,
		info,
		success,
		warning,
		error,
		systemAlert
	};
}

export const notification = createNotificationStore();