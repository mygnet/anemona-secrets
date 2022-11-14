<script>
    import ContentKey from "./Keys/Content.svelte";
    import Session from "../services/Session";
    let key = Session.get();
</script>

<main>
    <ContentKey {key} />
</main>