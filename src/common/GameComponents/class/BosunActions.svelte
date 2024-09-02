<script lang="ts">
    import { onMount } from "svelte";
    import { 
        Classes,
        socket,
        GameActions
    } from "../../../common/stores";

    onMount(() => {
        socket.on("connect_error", (err) => {
            console.error(err);
        });
    });

    const onAction = (action: GameActions) => {
        socket.emit("client_performs_action", {action});
    }
</script>

<div>
    <button on:click={()=>{onAction(GameActions.BosunDetect)}}>Detect Enemies</button>
    <button on:click={()=>{onAction(GameActions.BosunReduceFood)}}>Reduce Food Consumption</button>
    <button on:click={()=>{onAction(GameActions.BosunReducePellets)}}>Hone Pellet Usage</button>
</div>