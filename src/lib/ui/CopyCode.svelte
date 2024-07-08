<script lang="ts">
  $effect(() => {
    const copyBtnElement = document.querySelectorAll('.copy');

    function copyToClipboard(e: Event) {
      const buttonElement = e.currentTarget as Element;
      const codeTitleElement = buttonElement.parentElement;
      const text = codeTitleElement?.nextElementSibling?.textContent;

      if (text) {
        navigator.clipboard.writeText(text);
      }
    }

    copyBtnElement.forEach((btn) => {
      btn.addEventListener('click', copyToClipboard);
    });

    return () =>
      copyBtnElement.forEach((btn) =>
        btn.removeEventListener('click', copyToClipboard),
      );
  });
</script>
