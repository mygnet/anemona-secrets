<script>
  import { onMount } from "svelte";
  import Spinner from "./components/Spinner.svelte";
  import Session from "../services/Session";
  import State from "../services/State";
  import Command from "../services/Command";
  import Page from "../services/Page";
  import Lang from "../services/Lang";

  let loading = true;
  let data = [];

  const opneSession = function (rs) {
    Session.login(rs, (success) => {
      if (success) {
        Page.put("keys");
      } else {
        //
      }
    });
  };

  const newDocument = () => {
    Command.send("keys/new", (name) => {
      opneSession({ file: name });
    });
  };

  const openDocument = () => {
    Command.send("keys/open", (name) => {
      opneSession({ file: name });
    });
  };

  const selKeys = (name) => {
    opneSession({ file: name });
  };

  onMount(() => {
    State.drop();
    Command.send("keys/recent", (rs) => {
      data = rs;
      loading = false;
    });
  });
</script>

{#if loading}
  <Spinner />
{:else}
  <button type="button" class="m1" on:click={newDocument}>{Lang.get("create-keychain")}</button>
  <button type="button" class="m1" on:click={openDocument}>{Lang.get("open-keychain")}</button>
  {#if data.length}
    <h4 class="m1">{Lang.get("recent")}:</h4>
    <div class="m1 box-recent">
      {#each data as dd}
        <div on:click={() => selKeys(dd)}>{dd}</div>
      {/each}
    </div>
  {/if}
{/if}

<style>
  .box-recent div {
    cursor: pointer;
  }
</style>
