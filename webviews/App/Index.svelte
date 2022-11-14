<script>
  import Spinner from "./components/Spinner.svelte";
  import Login from "./Login.svelte";
  import About from "./About.svelte";
  import Logout from "./Logout.svelte";
  import Page from "../services/Page";
  import Lang from "../services/Lang";
  import Command from "../services/Command";
  import Session from "../services/Session";
  import State from "../services/State";
  import Keys from "./Keys.svelte";
  import Bye from "./Bye.svelte";
  import { onMount } from "svelte";

  let logs = "";
  let vType = "sidebar";
  let yScroll = 0;
  let current = Spinner;
  let idCurrent = "spinner";
  let pages = {
    about: About,
    keys: Keys,
    login: Login,
    logout: Logout,
  };

  const saveScroller = () => {
    yScroll = yScroll ? yScroll : State.get("scroll_" + idCurrent, 0.01);
    State.set("scroll_" + idCurrent, yScroll);
  };

  const setComponet = (componet) => {
    current = componet;
  };

  const onPage = (cmd, dat) => {
    setComponet(Spinner);
    idCurrent = cmd.shift();
    let pag = pages;
    if (idCurrent) {
      if (pag[idCurrent] && idCurrent !== "closed") Page.set(idCurrent);
      else {
        if (vType === "sidebar" && idCurrent !== "closed") idCurrent = "keys";
        else return setComponet(Bye);
      }
      return setComponet(pag[idCurrent]);
    }
    setComponet(Bye);
  };

  const addCommandListener = () => {
    window.addEventListener("message", async (event) => {
      const rd = event.data || {};
      if (Command.call(rd)) return;
      const cmd = rd.cmd.split("/");
      switch (cmd.shift()) {
        case "reloads":
          Command.send("reloads");
          return start();
        case "reload":
          return start();
        case "lang":
          return Lang.load(rd.dat, rd.dat);
        case "loading":
          return setComponet(Spinner);
      }
      onPage(cmd);
    });
  };

  const refresh = () => {
    //
  };
  
  const start = () => {
    setComponet(Spinner);
    Session.auth(vType);
  };

  onMount(() => {
    vType = document.body.id;
    Page.addEventListener((page) => onPage([page]));
    addCommandListener();
    start();
  });
</script>

<div class="anemona-app">
  <svelte:component this={current} />
</div>
{#if logs !== ""}
  <textarea rows="10">{logs}</textarea>
{/if}
<svelte:window on:scroll={saveScroller} bind:scrollY={yScroll} />

<style>
  :root {
    --container-paddding: 0px;
  }
  .anemona-app {
    padding: 2px;
    overflow-y: scroll; /* Hide vertical scrollbar */
    overflow-x: hidden; /* Hide horizontal scrollbar */
  }
  textarea {
    position: absolute;
    bottom: 0px;
    display: block;
    widows: 100%;
    height: 300px;
    overflow: scroll;
    color: black;
    background-color: white;
  }
</style>
