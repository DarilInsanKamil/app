<script lang="ts">
	import type { Snippet } from 'svelte';

	type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		disabled?: boolean;
		isLoading?: boolean;
		onclick?: () => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		isLoading = false,
		onclick,
		children
	}: Props = $props();

	const variantClasses: Record<Variant, string> = {
		primary: 'bg-yellow-300 border-black text-black hover:bg-yellow-400 active:bg-yellow-500',
		secondary: 'bg-white border-black text-black hover:bg-gray-100 active:bg-gray-200',
		danger: 'bg-red-400 border-black text-black hover:bg-red-500 active:bg-red-600',
		ghost:
			'bg-transparent border-black text-black hover:bg-black hover:text-white active:bg-gray-800 active:text-white'
	};

	const sizeClasses: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-5 py-2.5 text-base',
		lg: 'px-7 py-3.5 text-lg'
	};

	let isPressed = $state(false);

	function handleMouseDown() {
		if (!disabled && !isLoading) isPressed = true;
	}

	function handleMouseUp() {
		isPressed = false;
	}

	function handleClick() {
		if (!disabled && !isLoading) onclick?.();
	}
</script>

<button
	class="
    relative inline-flex cursor-pointer items-center justify-center
    gap-2 rounded-md border-[3px]
    border-black font-google
    font-black
    tracking-tight uppercase transition-all
    duration-75 ease-in-out
    select-none
    focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:outline-none
    disabled:translate-x-0 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
    {variantClasses[variant]}
    {sizeClasses[size]}
    {isPressed || disabled || isLoading
		? 'translate-x-[3px] translate-y-[3px] shadow-none'
		: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
  "
	{disabled}
	aria-disabled={disabled || isLoading}
	aria-busy={isLoading}
	onmousedown={handleMouseDown}
	onmouseup={handleMouseUp}
	onmouseleave={handleMouseUp}
	onclick={handleClick}
>
	{#if isLoading}
		<!-- Spinner -->
		<svg
			class="h-4 w-4 shrink-0 animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
		</svg>
		<span>loading…</span>
	{:else}
		{@render children()}
	{/if}
</button>
