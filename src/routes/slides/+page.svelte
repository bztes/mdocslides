<script lang="ts">
  import PostsMenu from '$lib/ui/PostsMenu.svelte';

  let { data } = $props();
</script>

<PostsMenu tree={data.postsTree} map={data.postsMap} />
