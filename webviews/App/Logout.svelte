<script>
  import Lang from "../services/Lang";
  import Page from "../services/Page";
  import Session from "../services/Session";

  const handleCancel = () => Page.back();
  const handleExitSession = () => {
    Session.drop();
  };
</script>

<div class="box-content">
  <h3 class=" p2">{Lang.get("are-you-sure-to-close")}</h3>
  <div class="clearfix">
    <div class="col col-6 center">
      <input type="button" class="btn" value={Lang.get("cancel")} on:click={handleCancel} />
    </div>
    <div class="col col-6 center">
      <button type="button" on:click={handleExitSession}>{Lang.get("close")}</button>
    </div>
  </div>
  <div />
</div>

<style>
  .box-content {
    align-items: center;
    justify-content: center;
  }
  input,
  button {
    display: inline-block;
    width: 90%;
  }
</style>
