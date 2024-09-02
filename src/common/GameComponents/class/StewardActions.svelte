<script lang="ts">
    import { onMount } from "svelte";
    import { 
        Classes,
        GameActions,
        socket
    } from "../../../common/stores";

    onMount(() => {
        socket.on("connect_error", (err) => {
            console.error(err);
        });
    });

    const onBuff = (classToBuff: Classes) => {
        socket.emit("client_performs_action", {action: GameActions.StewardBuff, class: classToBuff});
    }
</script>

<div>
    <button on:click={()=>{onBuff(Classes.Bosun)}}>Buff Bosun</button>
    <button on:click={()=>{onBuff(Classes.Topman)}}>Buff Topman</button>
    <button on:click={()=>{onBuff(Classes.Helmsman)}}>Buff Helmsman</button>
    <button on:click={()=>{onBuff(Classes.Gunner)}}>Buff Gunner</button>
    <button on:click={()=>{onBuff(Classes.Steward)}}>Buff Yonkadingo</button>
</div>