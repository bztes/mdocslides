<script lang="ts">
  let { max = 100, value = 0 } = $props();
  let relValue = $derived(`${(value / max) * 100}%`);
</script>

<div class="progress" style:--progress-bar-value={relValue}>
  <div class="progress-bar"></div>
</div>

<style>
  .progress {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 400;
  }

  .progress-bar {
    background-color: var(--primary);
    height: 4px;
    width: var(--progress-bar-value);
    transition: width 200ms ease-in-out;
  }
</style>
