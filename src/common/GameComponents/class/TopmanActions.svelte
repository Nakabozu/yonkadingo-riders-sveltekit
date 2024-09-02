<script lang="ts">
    import { GameActions, socket, topmanSelectedTiles, topmanWarning, totalTopmanTilesAllowed } from "../../stores";
    const submitReveals = () => {
        socket.emit('client_performs_action', {action: GameActions.TopmanReveal, coordinates: $topmanSelectedTiles});
        $topmanSelectedTiles = [];
    }
</script>

<section>
    <h1>
        Select Tiles to Reveal
    </h1>
    {#if $topmanWarning}
        <div class="warning">{$topmanWarning}</div>
    {/if}
    <div class="countdown">
        <div class="dseg">
            <div class="dseg-background">8</div>
            {$totalTopmanTilesAllowed - $topmanSelectedTiles.length}
        </div>
        Tiles Left
        <button on:click={submitReveals}>SUBMIT</button>
    </div>
</section>

<style>
    section{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .countdown{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
    }

    .countdown button{
        margin-left: 20px;
        padding: 3px 7px;
    }

    .dseg{
        border: 1px solid black;
        padding: 10px;
        font-family: "DSEG7";
        margin-right: 10px;
    }

    .dseg .dseg-background{
        color: black;
        position: absolute;
        opacity: .1;
    }

    .warning{
        color: red;
    }
</style>