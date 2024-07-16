<script lang="ts">
  import Progress from '$lib/ui/Progress.svelte';
  import SlideControls from '../SlideControls.svelte';

  let { data } = $props();

  let postElem: HTMLElement | undefined = $state();

  let slideIds = $derived(Object.keys(data.postSections));

  let selectedSlideIndex = $state(-1);
  let selectedSlideId = $state<string>();

  let visibleSlideElem: HTMLElement | undefined | null;
  $effect(() => {
    if (visibleSlideElem) {
      visibleSlideElem.classList.remove('visible');
    }
    if (selectedSlideId) {
      visibleSlideElem =
        document.getElementById(selectedSlideId)?.parentElement;
    }
    if (visibleSlideElem) {
      visibleSlideElem.classList.add('visible');
    }

    return () => {
      if (visibleSlideElem) {
        visibleSlideElem.classList.remove('visible');
      }
    };
  });

  $effect(() => {
    if (visibleSlideElem && overviewVisible) {
      visibleSlideElem.scrollIntoView({ block: 'nearest' });
    } else {
      window.scrollTo(0, 0);
    }
  });

  $effect(() => {
    selectedSlideId = getIdFromHash();
  });

  let overviewVisible = $state(false);

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 't') {
      overviewVisible = !overviewVisible;
    } else if (e.key == 'Escape') {
      overviewVisible = false;
    } else {
      return;
    }

    e.preventDefault();
  }

  function handleHashChange() {
    selectedSlideId = getIdFromHash();
    overviewVisible = false;
  }

  function getIdFromHash() {
    let id = window.location.hash.slice(1);
    if (!slideIds.includes(id)) {
      return slideIds[0];
    }
    return id;
  }
</script>

<svelte:window onkeydown={handleKeyDown} onhashchange={handleHashChange} />

<svelte:head>
  <title>{data.post.metadata.title}</title>
</svelte:head>

<Progress max={slideIds.length} value={selectedSlideIndex + 1} />

<SlideControls {slideIds} bind:selectedSlideIndex bind:selectedSlideId />

<article bind:this={postElem} class:overviewVisible>
  <svelte:component this={data.component} />
  <div class="pageNumber">{selectedSlideIndex + 1} / {slideIds.length}</div>
</article>

<style>
  article :global(section) {
    display: none;
  }
  article :global(section.visible) {
    display: block;
  }

  .pageNumber {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
  }

  article.overviewVisible {
    overflow: auto;
    cursor: default;
  }

  article.overviewVisible :global(.rehype-code-title button) {
    display: none;
  }

  article.overviewVisible :global(.rehype-code-title button) {
    display: none;
  }

  article.overviewVisible :global(h1),
  article.overviewVisible :global(h2) {
    position: static;
  }

  article.overviewVisible :global(a.icon-link) {
    display: grid;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: transparent;
    border-radius: 0.5rem;
  }

  article.overviewVisible :global(section) {
    position: relative;
    display: block;
    padding: 1rem;
    margin: 1rem;
    border: 1px solid var(--base-300);
    border-radius: 0.5rem;
    float: left;
    box-shadow: #959da533 0px 8px 24px;
    width: 300px;
    height: 400px;
    overflow: hidden;
    overflow: clip;
  }

  article.overviewVisible :global(section:not(.visible):hover) {
    border: 1px solid var(--primary);
  }

  article.overviewVisible :global(section.visible) {
    outline: 3px solid var(--primary);
    outline-offset: -1px;
  }
</style>
