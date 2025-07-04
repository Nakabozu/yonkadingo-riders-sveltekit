<script lang="ts">
    // Each tile should be clickable to produce a popup of what is known about the tile.
    // Traps?  Weather?  Was the enemy ship spotted here and the party hasn't traveled over it? etc.
    import { onMount, tick } from "svelte";
    import {
        ResourceTypes,
        Weathers,
        weatherIcons,
        isAnimationEnabled,
        currentTurn,
        Classes,
        topmanSelectedTiles,
        totalTopmanTilesAllowed,
        topmanWarning,
        helmsmanMovesPerformed,
        gunnerWarning,
        gunnerSelectedTiles,
        gunnerLaserDirection,
        yonkadingo,
    } from "../stores";

    // Image Assets
    import miniship from "../../assets/mini-ship.svg";
    import mine from "../../assets/mine.svg";
    import goodFood from "../../assets/yonkadingo-food-green.gif";
    import badFood from "../../assets/yonkadingo-food-red.gif";
    import pipis from "../../assets/arcane-pellet.webp";
    import epis from "../../assets/arcane-pellet-bad.webp"; // A typo but I liked it, lol
    import no from "../../assets/no.svg";

    // Svelte Components
    import TileSummaryModal from "./TileSummaryModal.svelte";

    // Properties
    export let isRevealed: boolean = true;
    export let isVisited: boolean = true;
    export let hasYonka: boolean = false;
    export let hasAI: boolean = false;
    export let hasMine: boolean = false;
    export let weather: Weathers | null = Weathers.AmpleTime;
    export let resourceType: ResourceTypes = ResourceTypes.Pellets;
    export let resourceCount: number = 1;
    export let indexOfTileInRevealArray: number = -1;
    export let rowIndex: number = -1;
    export let colIndex: number = -1;

    // Memos
    $: isVisible = isRevealed || isVisited;

    $: helmsmanPlannedMove = $helmsmanMovesPerformed.some(
        (move) => move.column === colIndex && move.row === rowIndex,
    );

    let tileDialogElement: HTMLDialogElement | null;
    $: indexOfTileInRevealArray = $topmanSelectedTiles.findIndex((tile) => {
        return tile?.row === rowIndex && tile?.column === colIndex;
    });
    $: indexOfTileInMineArray = $gunnerSelectedTiles.findIndex((tile) => {
        return tile?.row === rowIndex && tile?.column === colIndex;
    });

    $: isBeingLasered =
        $gunnerLaserDirection === "left"
            ? colIndex < $yonkadingo.location.column &&
              rowIndex === $yonkadingo.location.row
            : $gunnerLaserDirection === "right"
              ? colIndex > $yonkadingo.location.column &&
                rowIndex === $yonkadingo.location.row
              : $gunnerLaserDirection === "up"
                ? rowIndex < $yonkadingo.location.row &&
                  colIndex === $yonkadingo.location.column
                : $gunnerLaserDirection === "down"
                  ? rowIndex > $yonkadingo.location.row &&
                    colIndex === $yonkadingo.location.column
                  : false;

    const getWeatherIcon = (): string => {
        if (isVisible && weather && weather !== Weathers.Nothing) {
            return weatherIcons[weather];
        }
        return "\u00A0";
    };

    const onClickTile = () => {
        if ($currentTurn === Classes.Topman) {
            $topmanWarning = "";
            if (indexOfTileInRevealArray >= 0) {
                // This tile is already selected.  Remove it from the array.
                let temp = [...$topmanSelectedTiles];
                temp.splice(indexOfTileInRevealArray, 1);
                $topmanSelectedTiles = [...temp];
            } else if (
                $totalTopmanTilesAllowed > $topmanSelectedTiles?.length
            ) {
                // Topman can still select some stuff.  Let's select some stuff!
                $topmanSelectedTiles = [
                    ...$topmanSelectedTiles,
                    { row: rowIndex, column: colIndex },
                ];
            } else {
                // Dingus...
                $topmanWarning = "You can't reveal any more tiles!";
                setTimeout(() => {
                    $topmanWarning = "";
                }, 3000);
            }
        } else if ($currentTurn === Classes.Gunner) {
            $gunnerWarning = "";
            if (indexOfTileInMineArray >= 0) {
                // This tile is already selected.  Remove it from the array.
                let temp = [...$gunnerSelectedTiles];
                temp.splice(indexOfTileInMineArray, 1);
                $gunnerSelectedTiles = [...temp];
            } else if (
                $totalTopmanTilesAllowed > $gunnerSelectedTiles?.length
            ) {
                // Topman can still select some stuff.  Let's select some stuff!
                $gunnerSelectedTiles = [
                    ...$gunnerSelectedTiles,
                    { row: rowIndex, column: colIndex },
                ];
            } else {
                // Dingus...
                $gunnerWarning = "You can't reveal any more tiles!";
                setTimeout(() => {
                    $gunnerWarning = "";
                }, 3000);
            }
        }
    };

    const onContextMenuTile = (e: MouseEvent) => {
        e.preventDefault();
        tileDialogElement?.showModal();
    };
</script>

<TileSummaryModal
    {isRevealed}
    {isVisited}
    {hasYonka}
    {hasAI}
    {hasMine}
    {weather}
    {resourceType}
    {resourceCount}
    {rowIndex}
    {colIndex}
    bind:tileDialogElement
/>
<button
    id={`tile-${rowIndex}-${colIndex}`}
    class={`${isVisible ? "revealed-" : "unrevealed-"}tile ${
        indexOfTileInRevealArray >= 0 || isBeingLasered ? "glow" : ""
    } ${indexOfTileInMineArray >= 0 ? "mine-drop" : ""}`}
    style={`
        ${isVisible ? "--revealed-color: gold;" : "--revealed-color: white;"} 
        ${
            isVisible
                ? hasMine
                    ? "--mine-color: red;"
                    : "--mine-color: green;"
                : "--mine-color: black;"
        }
    `}
    on:click={onClickTile}
    on:contextmenu={onContextMenuTile}
>
    {#if isVisible}
        <!-- #region Resources -->
        {#if resourceType === ResourceTypes.Food}
            {#if resourceCount > 0}
                <div class="food-group">
                    <span
                        class={`food-count ${$isAnimationEnabled ? "" : "green"}`}
                        >{resourceCount}</span
                    >
                    {#if $isAnimationEnabled}
                        <img
                            src={goodFood}
                            alt="Food Gained"
                            height="20px"
                            width="20px"
                            class="ship food"
                        />
                    {/if}
                </div>
            {:else if resourceCount < 0}
                <div class="food-group">
                    <span
                        class={`food-count ${$isAnimationEnabled ? "" : "red"}`}
                        >{resourceCount}</span
                    >
                    {#if $isAnimationEnabled}
                        <img
                            src={badFood}
                            alt="Food Lost"
                            height="20px"
                            width="20px"
                            class="ship food"
                        />
                    {/if}
                </div>
            {:else}
                <div class="food-group">{"\u00A0"}</div>
            {/if}
        {:else if resourceType === ResourceTypes.Pellets}
            {#if resourceCount > 0}
                <div class="food-group">
                    <span
                        class={`food-count ${$isAnimationEnabled ? "" : "blue"}`}
                        >{resourceCount}</span
                    >
                    {#if $isAnimationEnabled}
                        <img
                            src={pipis}
                            alt="Pellets Gained"
                            height="15px"
                            width="20px"
                            class="ship pipis"
                        />
                    {/if}
                </div>
            {:else if resourceCount < 0}
                <div class="food-group">
                    <span
                        class={`food-count ${$isAnimationEnabled ? "" : "yellow"}`}
                        >{resourceCount}</span
                    >
                    {#if $isAnimationEnabled}
                        <img
                            src={epis}
                            alt="Pellets Lost"
                            height="15px"
                            width="20px"
                            class="ship pipis"
                        />
                    {/if}
                </div>
            {:else}
                <div class="food-group">{"\u00A0"}</div>
            {/if}
        {:else}
            <div class="food-group">{"\u00A0"}</div>
        {/if}
        <!-- #endregion -->
        <!-- #region Weather -->
        <!-- Will show the weather in the event that a ship has taken the normal weather spot-->
        <div class="weather">
            {#if hasYonka || hasAI || helmsmanPlannedMove}
                {getWeatherIcon()}
            {:else}
                {"\u00A0"}
            {/if}
        </div>
        <!-- #endregion -->
        <!-- #region Mines -->
        <div class="mine-container">
            {#if hasMine}
                <img
                    id="mine-here"
                    src={mine}
                    alt="MINE!"
                    width="20px"
                    class="mine"
                />
            {:else}
                <span class="mine-group">
                    <!-- <img src={no} alt="no" width="20px" class="no" />
                    <img src={mine} alt="mine" width="14px" class="no-mine" /> -->
                </span>
            {/if}
        </div>
        <!-- #endregion -->
        <!-- #region Ships/Weather -->
        <!-- If this tile has the Yonkadingo or the AI, this space is reserved for their ship icon.  Otherwise it shows the weather.  -->
        <div class="grid-bottom">
            {#if hasYonka || helmsmanPlannedMove}
                <img
                    src={miniship}
                    alt="Yonkadingo Location"
                    height="20px"
                    width="20px"
                    class="ship{helmsmanPlannedMove ? ' blinking' : ''}"
                />
            {:else if hasAI}
                <img
                    src={miniship}
                    alt="Enemy Location"
                    height="20px"
                    width="20px"
                    class="ship black-to-red"
                />
            {:else}
                {getWeatherIcon()}
            {/if}
        </div>
        <!-- #endregion -->
    {:else}
        <!-- #region Not Revealed -->
        <div>
            {#if helmsmanPlannedMove}
                <img
                    src={miniship}
                    alt="Yonkadingo Location"
                    height="20px"
                    width="20px"
                    class="ship blinking"
                />
            {:else}
                ?
            {/if}
        </div>
        <!-- #endregion -->
    {/if}
</button>

<style>
    /* #region CSS */
    .revealed-tile,
    .unrevealed-tile {
        background: var(--revealed-color);
        border: 1px solid var(--mine-color);

        margin: 0px;
        padding: 0px;
        height: calc(100% - 2px);
        width: calc(100% - 2px);
    }

    .revealed-tile {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1px;
    }

    .glow {
        background: radial-gradient(cyan, var(--revealed-color));
        animation: glow 1s infinite alternate;
    }

    .ship {
        height: 20px;
        width: 20px;
    }

    .food-group,
    .mine-group {
        height: 100%;
        width: 100%;

        position: relative;
        display: inline-flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        font-size: 20px;
    }

    .food-count {
        position: absolute;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-family: "Gill Sans", "Gill Sans MT", Helvetica, Calibri,
            "Trebuchet MS", sans-serif;
        width: 100%;
        height: 100%;
        text-align: center;
        vertical-align: middle;
    }

    .green,
    .red,
    .blue,
    .yellow {
        padding: 3px;
    }

    .green {
        color: #3bcc09;
    }

    .red {
        color: #b00000;
    }

    .blue {
        color: #00bfff;
    }

    .yellow {
        color: #ffff00;
    }

    .food {
        height: 20px;
        width: 20px;
    }

    .pipis {
        height: 15px;
        width: 20px;
    }

    .weather {
        justify-self: center;
        align-self: center;
    }

    .mine-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .no {
        height: 20px;
        width: 20px;

        position: absolute;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .mine {
        height: 20px;
        width: 20px;

        justify-self: center;
        align-self: center;
    }

    .no-mine {
        width: 14px;

        justify-self: center;
        align-self: center;
    }

    .grid-bottom {
        grid-column: 1 / span 3;
    }

    .black-to-red {
        filter: invert(14%) sepia(95%) saturate(2709%) hue-rotate(345deg)
            brightness(96%) contrast(103%);
    }

    .blinking {
        animation-name: blinking;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
    }

    .mine-drop {
        animation-name: blink-red;
        animation-duration: 1.5s;
        animation-iteration-count: infinite;
    }

    @keyframes blinking {
        0% {
            opacity: 1;
        }
        49% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        99% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes glow {
        from {
            box-shadow: 0 0 10px -10px whitesmoke;
        }
        to {
            box-shadow: 0 0 10px 10px whitesmoke;
        }
    }

    @keyframes blink-red {
        0% {
            background-color: red;
        }
        49% {
            background-color: red;
        }
        50% {
            background-color: inherit;
        }
        99% {
            background-color: inherit;
        }
        100% {
            background-color: red;
        }
    }
</style>
