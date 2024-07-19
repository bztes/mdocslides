<script lang="ts">
  import Progress from '$lib/ui/Progress.svelte';
  import SlideControls from '../SlideControls.svelte';
  import SlidesOverlay from '../SlidesOverlay.svelte';

  let { data } = $props();

  let slideIds = $derived(Object.keys(data.postSections));

  let selectedSlideIndex = $state(-1);
  let selectedSlideId = $state<string>();

  let selectedSlideElem: HTMLElement | undefined | null;
  $effect(() => {
    if (selectedSlideElem) {
      selectedSlideElem.classList.remove('visible');
    }

    if (selectedSlideId) {
      selectedSlideElem =
        document.getElementById(selectedSlideId)?.parentElement;
    }

    if (selectedSlideElem) {
      selectedSlideElem.classList.add('visible');
      selectedSlideElem.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      if (selectedSlideElem) {
        selectedSlideElem.classList.remove('visible');
      }
    };
  });

  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    overviewVisible;
    selectedSlideElem?.scrollIntoView({ block: 'nearest' });
  });

  $effect(() => {
    selectedSlideId = getIdFromHash();
  });

  let overviewVisible = $state(false);

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

  function handleScrollEnd(e: Event) {
    const elem = e.currentTarget as HTMLElement;
    selectedSlideIndex = Math.round(elem.scrollLeft / elem.clientWidth);
  }
</script>

<svelte:window onhashchange={handleHashChange} />

<svelte:head>
  <title>{data.post.metadata.title}</title>
</svelte:head>

<Progress max={slideIds.length} value={selectedSlideIndex + 1} />

<SlidesOverlay position="bottom-left">
  <SlideControls
    {slideIds}
    bind:selectedSlideIndex
    bind:selectedSlideId
    bind:overviewVisible
  />
</SlidesOverlay>

<SlidesOverlay position="bottom-right">
  {selectedSlideIndex + 1} / {slideIds.length}
</SlidesOverlay>

<article class:overviewVisible onscrollend={handleScrollEnd}>
  <svelte:component this={data.component} />
</article>

<style>
  article {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    scroll-snap-type: x mandatory;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none; /* Chrome an Safari */
    }

    :global(section) {
      flex: 0 0 auto;
      width: 100%;
      padding: 4rem;
      box-sizing: border-box;
      scroll-snap-align: center;
      scroll-snap-stop: always;
    }
  }

  article.overviewVisible {
    overflow: auto;
    cursor: default;
    flex-wrap: wrap;

    :global(.rehype-code-title button) {
      display: none;
    }

    :global(.rehype-code-title button) {
      display: none;
    }

    :global(h1),
    :global(h2) {
      position: static;
    }

    :global(a.icon-link) {
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

    :global(section) {
      position: relative;
      display: block;
      padding: 1rem;
      margin: 1rem;
      border: 1px solid var(--base-300);
      border-radius: 0.5rem;
      box-shadow: #959da533 0px 8px 24px;
      width: 300px;
      height: 400px;
      overflow: hidden;
      overflow: clip;
    }

    :global(section:not(.visible):hover) {
      border: 1px solid var(--primary);
    }

    :global(section.visible) {
      outline: 3px solid var(--primary);
      outline-offset: -1px;
    }
  }
</style>
