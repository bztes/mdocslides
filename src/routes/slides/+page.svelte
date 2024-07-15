<script lang="ts">
  import ArticlesMenu from '$lib/ui/ArticlesMenu.svelte';

  let { data } = $props();
</script>

<ArticlesMenu trees={data.articleTrees} map={data.articleMap} view="slides" />
