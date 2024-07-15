<script lang="ts">
  import CopyCode from '$lib/ui/CopyCode.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.post.metadata.title}</title>
</svelte:head>

<CopyCode />

<post>
  <svelte:component this={data.component} />
</post>
