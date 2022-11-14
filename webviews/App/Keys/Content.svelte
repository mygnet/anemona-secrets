<script>
  import Spinner from "../components/Spinner.svelte";
  import Element from "./Element.svelte";
  import { onMount } from "svelte";
  import Command from "../../services/Command";
  import State from "../../services/State";
  import { lang } from "../../services/Lang";

  export let key = {};

  let data = [];
  let content = {};
  let current = {};
  let lock = false;
  let inpts = {};
  let open = false;
  let show = "";
  let loading = true;
  let order = true;
  let inter = null;

  const onShow = (ty) => {
    if (ty === 1 && inpts.psw1) inpts.psw1.type = inpts.psw1.type === "text" ? "password" : "text";
    else if (ty === 2 && inpts.psw2) inpts.psw2.type = inpts.psw2.type === "text" ? "password" : "text";
  };

  const onOpen = (ty) => {
    open = !open;
  };

  const onExport = () => {
    Command.send("keys/export", { key: key, data: data, format: inpts.format }, (dd) => {
      //
    });
  };

  const onLock = () => {
    if (inpts.password1 !== inpts.password2) {
      Command.send("onInfo", lang("passwords-must-be-the-same"));
    } else {
      loading = true;
      const rs = content;
      rs.order = order ? 1 : 0;
      rs.data = data;
      Command.send("keys/lock", { key: key, data: rs, pwd: inpts.password1, clue: inpts.clue || "" }, (dd) => {
        lock = true;
        loading = false;
        open = false;
        content = dd;
        data = [];
        inpts = {};
      });
    }
  };

  const onUnLock = () => {
    loading = true;
    Command.send("keys/unlock", { key: key, data: content, pwd: inpts.password1 }, (dd) => {
      if (dd.data && dd.data instanceof Array) {
        content = dd;
        data = content.data;
        lock = false;
        open = false;
        inpts = {};
      } else {
        Command.send("onError", lang("invalid-password"));
      }
      loading = false;
    });
  };

  const onSave = (id, fields, xfunc, idx) => {
    if (id === "cancel") return xfunc();
    loading = true;
    if (id === "add") {
      data = [fields].concat(data);
      fields = {};
    } else if (id === "edit") {
      data[idx] = fields;
      data = data.concat([]);
    } else if (id === "del") {
      data.splice(idx, 1);
      data = data.concat([]);
      fields = {};
    }
    content.data = data;
    Command.send("keys/save", { key: key, data: content }, (dd) => {
      loading = false;
      xfunc(fields);
    });
  };

  const onOrder = () => {
    if (inter) return;
    inter = setTimeout(() => (inter = null), 500);
    order = !order;
    if (order) {
      data.sort(function (a, b) {
        a = a.title.toLowerCase();
        b = b.title.toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
      });
    } else {
      data.sort(function (a, b) {
        a = a.title.toLowerCase();
        b = b.title.toLowerCase();
        return a > b ? -1 : a < b ? 1 : 0;
      });
    }
    content.order = order ? 1 : 0;
    content.data = data;
    Command.send("keys/save", { key: key, data: content }, (dd) => {
      //
    });
    data = data.concat([]);
  };

  onMount(() => {
    State.set("key", key);
    Command.send("keys/get", key, (rs) => {
      loading = false;
      if (rs.message || rs.error) {
        State.set("key", undefined);
        return false;
      }
      lock = rs.lock ? true : false;
      content = rs;
      order = rs.order ? true : false;
      data = rs.lock ? [] : content.data || [];
    });
  });
</script>

{#if loading}
  <Spinner />
{:else if lock}
  <div class="flex">
    <div class="title ml1">{key.name}</div>
  </div>
  <form class="bg-box" on:submit|preventDefault={onUnLock}>
    <div class="flex">
      <button type="button" class="icon" on:click={() => onShow(1)} title={lang("see-password")}><i class="fa fa-eye" /></button>
      <input required bind:this={inpts.psw1} bind:value={inpts.password1} placeholder={lang("password")} type="password" />
    </div>
    <div class="flex mt2">
      <button type="submit">{lang("unlock")}</button>
    </div>
    {#if content.clue && content.clue !== "*"}
      <div class="note">
        {lang("hint-or-clue")}: "{content.clue}"
      </div>
    {/if}
  </form>
{:else}
  <div class="flex">
    <div class="title ml1">{key.name}</div>
    <span class="xicon fa-solid fa-arrow-up-{order ? 'a-z' : 'z-a'}" on:click={onOrder} title={lang("sort-list")} />
    <span class="xicon show fas {open ? 'fa-angle-down' : 'fa-ellipsis'}" on:click={onOpen} title={lang("options")} />
  </div>
  {#if open}
    <div class="toobars">
      <button class="btn" on:click={() => (show = show == "lock" ? "" : "lock")} title={lang("lock-keychain")}>
        <span class="fa fa-lock-open" />
      </button>
      <button class="btn" on:click={() => (show = show == "export" ? "" : "export")} title={lang("export")}>
        <span class="fas fa-file-export" />
      </button>
    </div>
    {#if show === "lock"}
      <form class="bg-box" on:submit|preventDefault={onLock}>
        <div class="flex">
          <button type="button" class="icon" on:click={() => onShow(1)} title={lang("see-password")}><i class="fa fa-eye" /></button>
          <input required bind:this={inpts.psw1} bind:value={inpts.password1} placeholder={lang("password")} type="password" />
        </div>
        <div class="flex">
          <button type="button" class="icon" on:click={() => onShow(2)}><i class="fa fa-eye" /></button>
          <input required bind:this={inpts.psw2} bind:value={inpts.password2} placeholder={lang("confirm-password")} type="password" />
        </div>
        <div class="flex">
          <input bind:value={inpts.clue} placeholder={lang("hint-or-clue")} type="text" />
        </div>
        <div class="flex mt2">
          <button type="submit">{lang("lock-keychain")}</button>
        </div>
        <div class="note">
          <i class="fas fa-exclamation" />
          {lang("alert-lock-keys")}
        </div>
      </form>
    {:else if show === "export"}
      <form class="bg-box" on:submit|preventDefault={onExport}>
        <div>
          <select class="select" bind:value={inpts.format}>
            <option value="txt">Plain text</option>
            <option value="json">Json</option>
          </select>
        </div>
        <div class="flex mt2">
          <button type="submit">{lang("export")}</button>
        </div>
      </form>
    {/if}
  {/if}
  <div class="mt1">
    <Element type="add" id="add" data={current} {onSave} />
    {#each data as dat, idx}
      <Element type="item" id={idx} data={dat} {onSave} />
    {/each}
  </div>
{/if}

<style>
  .xicon {
    display: block;
    font-size: 1rem;
    padding: 2px;
    margin: 2px;
    cursor: pointer;
    opacity: 0.5;
  }
  .xicon:hover {
    opacity: 1;
  }
  .btn {
    font-size: 0.8rem;
    float: right;
    width: 22px;
    height: 22px;
    display: block;
    margin-left: 2px;
  }
  input {
    height: 26px;
  }
  form {
    padding: 2px;
  }
  .toobars {
    background-color: var(--vscode-keybindingLabel-background);
    border-top: 1px solid var(--vscode-editorWidget-background);
    padding: 2px;
    width: 100%;
    display: block;
    height: 26px;
  }
  .bg-box {
    background-color: var(--vscode-keybindingLabel-background);
  }
  button {
    font-size: 0.9rem;
  }
  .note {
    color: var(--vscode-textPreformat-foreground);
    font-size: 0.8rem;
    padding: 2px;
    opacity: 0.7;
  }
  .icon {
    width: 22px;
    height: 26px;
  }
  .title {
    width: calc(100% - 26px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
