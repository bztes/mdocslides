<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.post.metadata.title}</title>
</svelte:head>

<article>
  <svelte:component this={data.component} />
</article>
