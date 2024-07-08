<script lang="ts">
  let controlsVisible = $state(false);

  interface Props {
    slideIds: string[];
    selectedSlideIndex: number;
    selectedSlideId: string | undefined;
  }
  let {
    slideIds,
    selectedSlideIndex = $bindable(-1),
    selectedSlideId = $bindable(),
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
    if (e.key === 'c') {
      controlsVisible = !controlsVisible;
    } else if (e.key === 'ArrowLeft') {
      selectPreviousSlide();
    } else if (e.key === 'ArrowRight' || e.key === ' ') {
      selectNextSlide();
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
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="controls" class:visible={controlsVisible}>
  <button
    onclick={selectPreviousSlide}
    class="button icon fixed previous_section"
    disabled={!hasPreviousSlide}
  >
    arrow_back
  </button>
  <button
    onclick={selectNextSlide}
    class="button icon fixed next_section"
    disabled={!hasNextSlide}
  >
    arrow_forward
  </button>
</div>

<style>
  .controls {
    visibility: hidden;

    &.visible {
      visibility: visible;
    }
  }

  .fixed {
    position: fixed;
    z-index: 200;
  }

  .previous_section {
    left: 1rem;
    top: 50vh;
  }

  .next_section {
    right: 1rem;
    top: 50vh;
  }
</style>
