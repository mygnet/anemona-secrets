<script>
  import Lang from "../services/Lang";
</script>

<div>
  <span class="dizzy" />
  <div><strong>{Lang.get("unknown-problem-occurred")}</strong></div>
  <div class="opts mt2">
    <div>{Lang.get("alternatives")}:</div>
    <ul>
      <li> &bull; {Lang.get("please-refresh")}</li>
      <li> &bull; {Lang.get("close-and-open")}</li>
      <li> &bull; {Lang.get("sign-out-and-sign")}</li>
    </ul>
  </div>
</div>

<style>
  .dizzy {
    display: block;
    width: 48px;
    height: 48px;
    background-image: url(../assets/images/face-worried.png);
  }
</style>
