<script lang="ts">
    import { onMount } from "svelte";
    import {
        helmsmanWarning,
        totalHelmsmanMovesAllowed,
        helmsmanMovesPerformed,
        socket,
        GameActions,
        yonkadingo,
        gameboard,
        isCoordEqual,
        gunnerLaserDirection,
        gunnerSelectedTiles,
    } from "../../stores";

    let warningMsg = "";
    let hoverMsg = "";

    const aimLaser = (move: "up" | "left" | "right" | "down") => {
        if ($gunnerLaserDirection === move) {
            $gunnerLaserDirection = null;
            return;
        }
        switch (move) {
            case "up":
                if ($yonkadingo.location.row <= 0) {
                    displayWarningMsg("Why!?  There's nothing up there!");
                    return;
                }
                break;
            case "left":
                if ($yonkadingo.location.column <= 0) {
                    displayWarningMsg("Why!?  There's nothing over there!");
                    return;
                }
                break;
            case "right":
                if ($yonkadingo.location.column + 1 >= $gameboard[0].length) {
                    displayWarningMsg("Why!?  There's nothing over there!");
                    return;
                }
                break;
            case "down":
                if ($yonkadingo.location.row + 1 >= $gameboard.length) {
                    displayWarningMsg("Why!?  There's nothing down there!");
                    return;
                }
                break;
        }
        // If we got through the switch case without an early return, we're good.
        $gunnerLaserDirection = move;
        $gunnerSelectedTiles = [];
    };

    const submitLaser = () => {
        socket.emit("client_performs_action", {
            action: GameActions.GunnerFire,
            direction: $gunnerLaserDirection,
        });
        $gunnerLaserDirection = null;
        $gunnerSelectedTiles = [];
    };

    const submitMines = () => {
        socket.emit("client_performs_action", {
            action: GameActions.GunnerMine,
            coordinates: $gunnerSelectedTiles,
        });
        $gunnerLaserDirection = null;
        $gunnerSelectedTiles = [];
    };

    const displayWarningMsg = (newWarningMsg: string) => {
        warningMsg = newWarningMsg;
        setTimeout(() => {
            warningMsg = "";
        }, 3000);
    };

    $: maxMinesToPlace = Math.max(3, Math.floor($yonkadingo.food / 3));
</script>

<section class="gun">
    {#if $helmsmanWarning}
        <div class="warning">{$helmsmanWarning}</div>
    {/if}

    <div class="controls">
        <div class="laser">
            <h1>Fire Laser!</h1>

            <div class="arrows">
                <button
                    class="up"
                    on:click={() => {
                        aimLaser("up");
                    }}>↑</button
                >
                <button
                    class="left"
                    on:click={() => {
                        aimLaser("left");
                    }}>←</button
                >
                <button
                    class="right"
                    on:click={() => {
                        aimLaser("right");
                    }}>→</button
                >
                <button
                    class="down"
                    on:click={() => {
                        aimLaser("down");
                    }}>↓</button
                >
            </div>
            <button on:click={submitLaser} disabled={!$gunnerLaserDirection}>
                {!$gunnerLaserDirection
                    ? "Aim Laser to Fire"
                    : `FIRE LASER ${$gunnerLaserDirection?.toLocaleUpperCase()}!`}
            </button>
        </div>
        OR
        <div class="mines">
            <h1
                on:mouseenter={() => {
                    hoverMsg = "Click on red-bordered tiles to drop a mine";
                    setTimeout(() => {
                        hoverMsg = "";
                    }, 2000);
                }}
            >
                Drop Mines!
            </h1>
            <div class="countdown">
                <div class="dseg">
                    <div class="dseg-background">8</div>
                    {maxMinesToPlace - $gunnerSelectedTiles.length}
                </div>
            </div>
            <button
                on:click={submitMines}
                disabled={!$gunnerSelectedTiles?.length ||
                    $gunnerSelectedTiles.length <= 0}
            >
                {!$gunnerSelectedTiles?.length ||
                $gunnerSelectedTiles.length <= 0
                    ? "Click a red-bordered tile"
                    : `Drop ${$gunnerSelectedTiles.length} Mine${$gunnerSelectedTiles.length > 1 ? "s" : ""}!`}
            </button>
        </div>
    </div>

    {#if warningMsg}
        <div class="warning">
            {warningMsg}
        </div>
    {/if}
    {#if hoverMsg}
        <div>
            {hoverMsg}
        </div>
    {/if}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        justify-content: center;
    }
    .controls {
        display: flex;
        flex-direction: row;
        gap: max(20px, 5%);
    }
    .laser {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }
    .arrows {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2px;
        height: 100px;
        width: 100px;
    }
    .up,
    .down,
    .left,
    .right {
        border-radius: 50%;
        width: 100%;
        height: 100%;
    }
    .up {
        grid-row-start: 1;
        grid-column-start: 2;
    }
    .left {
        grid-row-start: 2;
        grid-column-start: 1;
    }
    .right {
        grid-row-start: 2;
        grid-column-start: 3;
    }
    .down {
        grid-row-start: 3;
        grid-column-start: 2;
    }

    .mines {
        display: flex;
        flex-direction: column;
    }
    /** COUNTDOWN STYLES */
    .countdown {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
        flex-grow: 1;
    }

    .dseg {
        border: 1px solid black;
        padding: 10px;
        font-family: "DSEG7";
        margin-right: 10px;
    }

    .dseg .dseg-background {
        color: black;
        position: absolute;
        opacity: 0.1;
    }
</style>
