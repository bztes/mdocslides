<script lang="ts">
  import PostsMenu from '$lib/ui/PostsMenu.svelte';

  let { data } = $props();
</script>

<PostsMenu trees={data.postTrees} map={data.postMap} view="slides" />
