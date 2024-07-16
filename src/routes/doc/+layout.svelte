<script lang="ts">
  import './style.css';
  import Header from './Header.svelte';
  import PostsMenu from '$lib/ui/PostsMenu.svelte';
  import { setContext } from 'svelte';

  let { data, children } = $props();

  setContext('view', 'doc');
</script>

<div class="page light-theme">
  <Header />

  <aside>
    <nav>
      <PostsMenu tree={data.postsTree} map={data.postsMap} />
    </nav>
  </aside>

  <main>
    {@render children()}
  </main>
</div>

<style>
  .page {
    --sidebar-width: 300px;
  }

  aside {
    width: var(--sidebar-width);
    position: fixed;
    top: 0;
    box-sizing: border-box;
    height: 100vh;
    padding-top: var(--header-height);
    overflow: hidden auto;
    border-right: 1px solid var(--base-300);
  }

  nav {
    border-top: 1px solid var(--base-300);
    padding: 1rem;
  }

  main {
    margin-left: var(--sidebar-width);
    box-sizing: border-box;
    padding: 1rem 1rem 1rem 3rem;
  }
</style>
