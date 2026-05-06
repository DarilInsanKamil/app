export const toastStore = $state({
	toasts: []
});

export function addToast(message: string, type = 'success', duration = 3000) {
	const id = crypto.randomUUID();

	toastStore.toasts.push({ id, message, type });

	if (duration > 0) {
		setTimeout(() => {
			removeToast(id);
		}, duration);
	}
}

export function removeToast(id: string) {
	toastStore.toasts = toastStore.toasts.filter((t: any) => t.id !== id);
}
