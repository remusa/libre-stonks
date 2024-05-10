<script lang="ts">
import { cn } from '$lib/utils'
import type { HTMLAttributes } from 'svelte/elements'

type $$Props = HTMLAttributes<HTMLHeadingElement> & {
	tag?: 'h3'
}

let className: $$Props['class'] = undefined
export { className as class }
</script>

<h3 class={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}><slot /></h3>
