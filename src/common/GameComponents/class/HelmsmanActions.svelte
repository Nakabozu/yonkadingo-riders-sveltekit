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
    } from "../../stores";

    let warningMsg = "";

    $: lastCoord =
        $helmsmanMovesPerformed.length > 0
            ? $helmsmanMovesPerformed[$helmsmanMovesPerformed.length - 1]
            : $yonkadingo.location;

    onMount(() => {
        console.log(lastCoord);
    });

    const makeAMove = (move: "up" | "left" | "right" | "down") => {
        let newCoord;
        switch (move) {
            case "up":
                if (lastCoord.row <= 0) {
                    displayWarningMsg("You're at the top of the lake!");
                    return;
                }
                newCoord = { row: lastCoord.row - 1, column: lastCoord.column };
                break;
            case "left":
                if (lastCoord.column <= 0) {
                    displayWarningMsg(
                        "You're already at the leftmost edge of the lake!",
                    );
                    return;
                }
                newCoord = { row: lastCoord.row, column: lastCoord.column - 1 };
                break;
            case "right":
                if (lastCoord.column + 1 >= $gameboard[0].length) {
                    displayWarningMsg(
                        "You're already at the rightmost edge of the lake!",
                    );
                    return;
                }
                newCoord = { row: lastCoord.row, column: lastCoord.column + 1 };
                break;
            case "down":
                if (lastCoord.row + 1 >= $gameboard.length) {
                    displayWarningMsg("You're at the bottom of the lake!");
                    return;
                }
                newCoord = { row: lastCoord.row + 1, column: lastCoord.column };
                break;
        }

        // If the helmsman is moving back to their previous location, then we can pop the last item off the stack
        if (
            ($helmsmanMovesPerformed.length === 1 &&
                isCoordEqual($yonkadingo.location, newCoord)) ||
            ($helmsmanMovesPerformed.length >= 2 &&
                isCoordEqual(
                    $helmsmanMovesPerformed[$helmsmanMovesPerformed.length - 2],
                    newCoord,
                ))
        ) {
            console.log("UNDOING A MOVE VIA ARROWS");
            undoMove();
        } else if (
            $totalHelmsmanMovesAllowed - $helmsmanMovesPerformed.length <=
            0
        ) {
            displayWarningMsg("You're out of moves!");
            return;
        } else {
            $helmsmanMovesPerformed = [...$helmsmanMovesPerformed, newCoord];
        }
    };

    const undoMove = () => {
        if ($helmsmanMovesPerformed.length <= 0) {
            displayWarningMsg("You haven't made any moves!");
        }
        // Note, we can't pop off of the $helmsmanMovesPerformed array
        // because Svelte uses assignment to recognize state updates so "=" is required
        let poppedMoves = $helmsmanMovesPerformed;
        poppedMoves.pop();
        $helmsmanMovesPerformed = [...poppedMoves];
    };

    const submitMoves = () => {
        socket.emit("client_performs_action", {
            action: GameActions.HelmsmanMove,
            coordinates: $helmsmanMovesPerformed,
        });
        $helmsmanMovesPerformed = [];
    };

    const displayWarningMsg = (newWarningMsg: string) => {
        warningMsg = newWarningMsg;
        setTimeout(() => {
            warningMsg = "";
        }, 3000);
    };
</script>

<section class="helm">
    <h1>Steer the Yonkadingo!</h1>
    {#if $helmsmanWarning}
        <div class="warning">{$helmsmanWarning}</div>
    {/if}

    <div class="movement">
        <div class="controls">
            <button
                class="up"
                on:click={() => {
                    makeAMove("up");
                }}>↑</button
            >
            <button
                class="left"
                on:click={() => {
                    makeAMove("left");
                }}>←</button
            >
            <button
                class="right"
                on:click={() => {
                    makeAMove("right");
                }}>→</button
            >
            <button
                class="down"
                on:click={() => {
                    makeAMove("down");
                }}>↓</button
            >
        </div>
        <div class="countdown">
            <div class="dseg">
                <div class="dseg-background">8</div>
                {$totalHelmsmanMovesAllowed - $helmsmanMovesPerformed.length}
            </div>
            Moves Left
        </div>
    </div>
    <button on:click={submitMoves}>SUBMIT MOVES</button>
    {#if warningMsg}
        <div class="warning">
            {warningMsg}
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
    /** CONTROLS GRID STYLES */
    .movement {
        display: flex;
        direction: row;
        gap: 20px;
        margin: 10px;
    }

    .controls {
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2px;
        width: 50%;
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
    .countdown {
        grid-row-start: 2;
        grid-column-start: 2;
    }

    /** COUNTDOWN STYLES */
    .countdown {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
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
