<script lang="ts">
  import CopyCode from '$lib/ui/CopyCode.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.article.metadata.title}</title>
</svelte:head>

<CopyCode />

<article>
  <svelte:component this={data.component} />
</article>
