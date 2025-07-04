<script lang="ts">
    // Ahh, the gameboard.  Should always be at the top left of the screen when it's not the focus of the screen.
    // Each tile should be clickable to produce a popup of what is known about the tile.  Traps?  Weather?  Was the enemy ship spotted here and the party hasn't traveled over it? etc.
    import {
        socket,
        gameboard,
        helmsmanMovesPerformed,
        type GameBoardTile,
    } from "../stores";
    import Tile from "./Tile.svelte";

    const logGameboard = () => {
        console.log($gameboard);
    };

    const letterLookup = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
    ];

    let rowCount = $gameboard?.length; // + 1;
    let columnCount = $gameboard?.[0]?.length; // + 1;

    socket.on("server_updates_grid", (newGameboard: GameBoardTile[][]) => {
        $gameboard = newGameboard;
        // newGameboard.forEach((row, ri) => {
        //     row.forEach((col, ci) => {
        //         if(col.hasYonka){
        //             $yonkadingoLocation = {row: ri, column: ci};
        //         }
        //     })
        // })
    });
</script>

<div
    class="background"
    style={`--row-count: ${rowCount}; --col-count: ${columnCount}`}
>
    <h1>Gameboard</h1>
    {JSON.stringify($helmsmanMovesPerformed)}
    <button on:click={logGameboard}>LOG GAMEBOARD</button>
    <div class="the-griddy">
        {#each { length: rowCount } as _, i}
            {#if i === 0}
                <div></div>
                <th>{letterLookup[i].toLocaleUpperCase()}</th>
            {:else}
                <th>{letterLookup[i].toLocaleUpperCase()}</th>
            {/if}
        {/each}
        {#each $gameboard as row, rowIndex}
            <th class="row-header">{rowIndex + 1}</th>
            {#each row as tileData, colIndex}
                {#if tileData}
                    <Tile {...tileData} {rowIndex} {colIndex} />
                {:else}
                    <Tile
                        isRevealed={false}
                        isVisited={false}
                        {rowIndex}
                        {colIndex}
                    />
                {/if}
            {/each}
        {/each}
    </div>
</div>

<style>
    .the-griddy {
        display: grid;
        grid-template-columns: min-content repeat(var(--col-count), 1fr);
        gap: 2px;

        padding: 0px 10px;

        overflow: scroll;
    }

    th {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .row-header {
        padding: 10px;
    }
</style>
