<script>
    import { onMount } from "svelte";
    import Command from "../../services/Command";
    import Clipboard from "../components/Clipboard.svelte";
    import Lang, { lang, langKey } from "../../services/Lang";

    export let id = "";
    export let data = {};
    export let type = "add";
    export let onSave = (text) => {};

    let show = "new";
    let disabled = {};
    let resp = {};
    let passwd = null;
    let open = false;

    let items = [];
    let options = [];
    let opts = ["nick", "email", "token", "host", "web", "link", "tel", "api", "ip", "port", "db-name", "notes"];
    let itemValue = "0";

    const clone = (dd) => {
        if (!dd) return {};
        let rs = {};
        for (const x in dd) rs[x] = dd[x];
        return rs;
    };
    const getOptions = () => {
        let idx = -1;
        options = opts.concat([]);
        items = [];
        for (const name in data) {
            if (name === "password" || name === "title") continue;
            items.push(name);
            idx = options.indexOf(name);
            if (idx !== -1) options.splice(idx, 1);
        }
        items.sort();
        options.sort();
    };
    const setShowData = (_data, _type, _resp) => {
        show = _type || type;
        data = _data || {};
        resp = _resp || clone(_data) || {};
        getOptions();
    };
    const onCancel = () => {
        setShowData(clone(resp), type, resp);
    };
    const onShow = () => {
        if (passwd) passwd.type = passwd.type === "text" ? "password" : "text";
    };
    const onEdit = () => {
        onSave(id === "add" ? "add" : "edit", clone(data), (dd) => setShowData(id === "add" ? {} : dd, type), id);
    };
    const onDelete = () => {
        onSave("del", data, (dd) => setShowData({}), id);
    };
    const showEdit = () => {
        setShowData(clone(resp), "edit", resp);
    };
    const onAddItem = () => {
        if (itemValue !== "0") {
            data[itemValue] = resp[itemValue] || data[itemValue] || "";
            getOptions();
        }
    };
    const onDelItem = (itm) => {
        resp[itm] = data[itm];
        delete data[itm];
        getOptions();
    };
    onMount(() => {
        setShowData(id === "add" ? {} : data, type, clone(data));
        disabled = {
            nick: !!data.nick,
            link: !!data.link,
            notes: !!data.notes,
        };
    });
</script>

<div>
    {#if show === "new" || show === "edit"}
        <form class="bg-box p1" on:submit|preventDefault={onEdit}>
            <input required bind:value={data.title} placeholder={lang("title")} type="text" />
            <div class="flex">
                <button type="button" class="icon" on:click={onShow} title={lang("see-password")}><i class="fa fa-eye" /></button>
                <input required bind:this={passwd} bind:value={data.password} placeholder={lang("password")} type="password" />
            </div>
            {#if options.length}
                <div class="flex">
                    <select class="select" bind:value={itemValue}>
                        <option value="0">{Lang.get('select-an-option')}</option>
                        {#each options as op}
                            <option value={op}>{Lang.get(op)}</option>
                        {/each}
                    </select>
                    <button type="button" class="icon" on:click={onAddItem} title={lang("see-password")}><i class="fa fa-plus" /></button>
                </div>
            {/if}
            {#each items as item}
                <div>
                    <span class="x-label">{Lang.get(item)}:</span>
                    <div class="flex">
                        <input type="text" required="required" bind:value={data[item]} placeholder={lang(item)} />
                        <button type="button" class="icon btn-cancel" on:click={() => onDelItem(item)} title="Quitar"><i class="fa-solid fa-xmark" /></button>
                    </div>
                </div>
            {/each}

            <div class="flex mt2">
                <button class="btn-cancel" type="button" on:click={onCancel}>{lang("cancel")}</button>
                <button type="submit">{lang("save")}</button>
            </div>
        </form>
    {:else if show === "del"}
        <form class="bg-box p1" on:submit|preventDefault={onDelete}>
            <div class="flex">
                <input readonly bind:value={data.title} placeholder={lang("title")} type="text" />
            </div>
            <div class="flex mt2">
                <button class="btn-cancel" type="button" on:click={onCancel}>{lang("cancel")}</button>
                <button type="submit">{lang("delete")}</button>
            </div>
        </form>
    {:else if show === "item"}
        <div class="box-password">
            <div>
                <div class="title">{data.title}</div>
            </div>
            <div class="flex">
                <Clipboard text={data.password} let:copy on:copy={() => Command.send("onInfo", lang("password-clipboard"))}>
                    <span class="xicon fa fa-copy" title={lang("copy")} on:click={copy} />
                </Clipboard>
                <span class="xicon fa fa-eye" on:click={onShow} title={lang("see-password")} />
                <input class="box-pswd" bind:this={passwd} type="password" value={data.password} />
                <span class="xicon show fas {open ? 'fa-angle-down' : 'fa-ellipsis'}" on:click={() => (open = !open)} title={lang("options")} />
            </div>
            {#if open}
                <div class="toobars">
                    <span class="xicon far fa-trash-alt" on:click={() => (show = "del")} title={lang("delete")} />
                    <span class="xicon fa fa-edit" on:click={showEdit} title={lang("edit")} />
                </div>
                <div class="">
                    {#each items as i}
                        {#if i !== "title" && i !== "password"}
                            <div class="flex">
                                <Clipboard text={data[i]} let:copy on:copy={() => Command.send("onInfo", lang("have-copied") + ": " + langKey(i))}>
                                    <span class="xicon copy fa fa-copy" title={lang("copy")} on:click={copy} />
                                </Clipboard>
                                <div class="other">
                                    <span>{langKey(i)}</span>
                                    <div class="text">
                                        {#if ["link", "web"].indexOf(i) !== -1}
                                            <a class="wrap" target="_blank" href={data[i]}>{data[i]}</a>
                                        {:else}
                                            {data[i]}
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
    {:else if show === "add"}
        <button class="btn" on:click={() => (show = "new")}>
            <i class="fa fa-plus" />
            <span>{lang("add-password")}</span>
        </button>
    {/if}
</div>

<style>
    .box-pswd {
        background-color: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
    }
    .bg-box {
        background-color: var(--vscode-keybindingLabel-background);
    }
    .other {
        width: 100%;
        padding-left: 5px;
        font-size: 0.9rem;
        background-color: var(--vscode-keybindingLabel-background);
    }
    .other span {
        display: block;
        border-top: 1px solid var(--vscode-editorWidget-background);
        font-size: 0.7rem;
        opacity: 0.7;
    }
    .xicon.copy {
        display: block;
        margin-top: 8px;
        font-size: 1rem;
    }
    .other div.text {
        font-size: 0.9rem;
        padding-bottom: 2px;
    }
    .other div.text {
        width: calc(100% - 34px);
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .toobars {
        background-color: var(--vscode-keybindingLabel-background);
        border-top: 1px solid var(--vscode-editorWidget-background);
        text-align: right;
        padding: 2px;
    }
    .box-password {
        background-color: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
        padding: 2px;
        margin-top: 5px;
    }
    .box-password .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-left: 45px;
        font-size: 0.7rem;
        opacity: 0.7;
    }
    .box-password input {
        height: 21px;
        margin-bottom: 0px;
    }

    .xicon {
        font-size: 0.9rem;
        padding: 2px;
        margin: 2px;
        cursor: pointer;
        opacity: 0.5;
    }

    .xicon:hover {
        opacity: 1;
    }
    .x-label {
        font-size: 0.8rem;
        opacity: 0.5;
    }
    input:disabled {
        text-decoration: line-through;
        background-color: transparent;
    }
    select,
    input {
        height: 26px;
        margin-bottom: 4px;
        font-size: 0.9rem;
        padding-top: 2px;
    }
    button {
        font-size: 0.9rem;
    }
    .icon {
        width: 22px;
        height: 26px;
        margin-right: 3px;
    }
    .btn-cancel {
        background-color: var(--vscode-button-secondaryBackground);
        color: var(--vscode-button-secondaryForeground);
    }
</style>
