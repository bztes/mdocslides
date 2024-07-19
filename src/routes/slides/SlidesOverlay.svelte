<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    position: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  }

  let { children, position = 'top-right' }: Props = $props();
</script>

<div class={position}>
  {@render children()}
</div>

<style>
  div {
    position: absolute;
    opacity: 0.7;
    display: flex;
    gap: 1rem;
  }

  .top-left {
    top: 1rem;
    left: 1rem;
  }

  .top-right {
    top: 1rem;
    right: 1rem;
  }

  .bottom-right {
    bottom: 1rem;
    right: 1rem;
  }

  .bottom-left {
    bottom: 1rem;
    left: 1rem;
  }
</style>
