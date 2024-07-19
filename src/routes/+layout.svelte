<script lang="ts">
  let { children } = $props();

  $effect(() => {
    window.addEventListener('copycode', copyToClipboard, true);

    function copyToClipboard(e: Event) {
      const buttonElement = e.target as Element;
      const codeTitleElement = buttonElement.parentElement;
      const text = codeTitleElement?.nextElementSibling?.textContent;

      if (text) {
        navigator.clipboard.writeText(text);
      }
    }

    return () => window.removeEventListener('copycode', copyToClipboard);
  });
</script>

{@render children()}
