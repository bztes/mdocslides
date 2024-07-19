<script lang="ts">
  import { base } from '$app/paths';

  interface Props {
    slideIds: string[];
    selectedSlideIndex?: number;
    selectedSlideId?: string;
    overviewVisible?: boolean;
  }
  let {
    slideIds,
    selectedSlideIndex = $bindable(-1),
    selectedSlideId = $bindable<string>(),
    overviewVisible = $bindable(false),
  }: Props = $props();

  let hasPreviousSlide = $derived(selectedSlideIndex > 0);
  let hasNextSlide = $derived(selectedSlideIndex < slideIds.length - 1);

  $effect(() => {
    selectedSlideIndex = slideIds.length > 0 ? 0 : -1;
  });

  $effect(() => {
    selectedSlideId = slideIds[selectedSlideIndex];
  });

  $effect(() => {
    selectedSlideIndex = selectedSlideId
      ? slideIds.indexOf(selectedSlideId)
      : -1;
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      selectPreviousSlide();
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
      selectNextSlide();
    } else if (e.key === 'o') {
      overviewVisible = !overviewVisible;
    } else if (e.key === 'Escape' || e.key === 'Enter') {
      overviewVisible = false;
    } else {
      return;
    }

    e.preventDefault();
  }

  function selectPreviousSlide() {
    if (hasPreviousSlide) {
      selectedSlideIndex--;
    }
  }

  function selectNextSlide() {
    if (hasNextSlide) {
      selectedSlideIndex++;
    }
  }

  function toggleOverview() {
    overviewVisible = !overviewVisible;
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<button
  onclick={selectPreviousSlide}
  class="icon"
  disabled={!hasPreviousSlide}
  title="Previous Slide"
>
  arrow_back
</button>
<button
  onclick={selectNextSlide}
  class="icon"
  disabled={!hasNextSlide}
  title="Next Slide"
>
  arrow_forward
</button>
<button
  onclick={toggleOverview}
  class="icon"
  class:active={overviewVisible}
  title="Slides Overview"
>
  grid_view
</button>
<a href={`${base}/slides`} class="button icon" title="Table of Content">toc</a>
