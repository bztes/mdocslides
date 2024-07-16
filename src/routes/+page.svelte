<script>
  import { base } from '$app/paths';
</script>

<div class="cover">
  <h1>MDocSlides</h1>
  <nav>
    <a href={`${base}/doc`} class="button button-primary">Pages</a>
    <a href={`${base}/slides`} class="button button-primary">Slides</a>
  </nav>
</div>

<style>
  .cover {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 2rem;
  }

  h1 {
    margin: 0;
  }

  nav {
    display: flex;
    gap: 2rem;
  }

  a {
    font-size: 1.2rem;
  }
</style>
