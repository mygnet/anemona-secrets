<script>
  import Lang from "../services/Lang";
</script>

<div class="m1">
  <div class="center">
    <span class="logo" />
    <div class="mb2">
      <strong>{Lang.get('password-manager')}</strong>
    </div>
  </div>
  <div>
    {Lang.get("about-text")}
  </div>
  <div class="opts mt2">
    <div class="mb2"><strong>{Lang.get("contributing")}</strong></div>
    <p>
      {Lang.get("please-create-an-issue")}
    </p>
  </div>
</div>

<style>
  .logo {
    display: inline-block;
    width: 171px;
    height: 171px;
    background-image: url(../logo.png);
  }
</style>
