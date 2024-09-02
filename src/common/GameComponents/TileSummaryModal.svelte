<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
    import { ResourceTypes, Weathers } from "../stores";
    import { weatherIcons } from "../stores";
    import {
        notRevealed,
        weatherDescriptions,
        tileHasYonkadingo,
        tileHasAI,
        tileHasMine,
        tileHasNoMine,
        getResourceMessage,
        //@ts-ignore
    } from "../longStrings/tileSummaryStrings";
    // Image Assets
    import miniship from "../../assets/mini-ship.svg";
    import mine from "../../assets/mine.svg";
    import goodFood from "../../assets/yonkadingo-food-green.gif";
    import badFood from "../../assets/yonkadingo-food-red.gif";
    import pipis from "../../assets/arcane-pellet.webp";
    import epis from "../../assets/arcane-pellet-bad.webp"; // A typo but I liked it, lol
    import no from "../../assets/no.svg";

    export let tileDialogElement: HTMLDialogElement | null;

    // Properties
    export let isRevealed: boolean = true;
    export let hasYonka: boolean = false;
    export let hasAI: boolean = false;
    export let hasMine: boolean = false;
    export let weather: Weathers | null = Weathers.Nothing;
    export let resourceType: ResourceTypes = ResourceTypes.Pellets;
    export let resourceCount: number = 1;
    export let rowIndex: number = -1;
    export let colIndex: number = -1;

    // Some quirky javascript to get the modal to open in a way that browsers actually like
    const closeModal = () => {
        tileDialogElement?.close();
    };

    // Helper JavaScript
    export const getWeatherIcon = (): string => {
        if (isRevealed && weather && weather !== Weathers.Nothing) {
            return weatherIcons[weather];
        }
        return "\u00A0";
    };
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
    id={`tile-summary-modal-${rowIndex}-${colIndex}`}
    bind:this={tileDialogElement}
    on:click={closeModal}
>
    {#if isRevealed}
        <h1>Revealed Tile Summary</h1>

        {#if hasYonka}
            <p>
                <img
                    src={miniship}
                    alt="Yonkadingo Location"
                    height="20px"
                    width="20px"
                    class="ship"
                />
                {tileHasYonkadingo}
            </p>
        {/if}
        {#if hasAI}
            <p>
                <img
                    src={miniship}
                    alt="Enemy Location"
                    height="20px"
                    width="20px"
                    class="ship black-to-red"
                />
                {tileHasAI}
            </p>
        {/if}

        <p>
            {#if resourceType === ResourceTypes.Food}
                {#if resourceCount > 0}
                    <div class="food-group">
                        <span class="food-count">{resourceCount}</span><img
                            src={goodFood}
                            alt="Food Gained"
                            height="20px"
                            width="20px"
                            class="ship food"
                        />
                    </div>
                {:else if resourceCount < 0}
                    <div class="food-group">
                        <span class="food-count">{resourceCount}</span><img
                            src={badFood}
                            alt="Food Lost"
                            height="20px"
                            width="20px"
                            class="ship food"
                        />
                    </div>
                {:else}
                    <div class="food-group">{"\u00A0"}</div>
                {/if}
            {:else if resourceCount > 0}
                <div class="food-group">
                    <span class="food-count">{resourceCount}</span><img
                        src={pipis}
                        alt="Pellets Gained"
                        height="15px"
                        width="20px"
                        class="ship pipis"
                    />
                </div>
            {:else if resourceCount < 0}
                <div class="food-group">
                    <span class="food-count">{resourceCount}</span><img
                        src={epis}
                        alt="Pellets Lost"
                        height="15px"
                        width="20px"
                        class="ship pipis"
                    />
                </div>
            {:else}
                <div class="food-group">{"\u00A0"}</div>
            {/if}
            {getResourceMessage(resourceType, resourceCount)}
        </p>

        <p>
            {#if hasMine}
                <img src={mine} alt="MINE!" width="20px" class="mine" />
                {tileHasMine}
            {:else}
                <span class="mine-group">
                    <img src={no} alt="no" width="20px" class="no" />
                    <img src={mine} alt="mine" width="14px" class="no-mine" />
                </span>
                {tileHasNoMine}
            {/if}
        </p>
        <p>{weatherDescriptions[weather ?? 1]}</p>
    {:else}
        <h1>Concealed Tile Summary</h1>
        <p>
            {notRevealed}
        </p>
    {/if}
</dialog>

<style>
    dialog {
        position: absolute;
        top: 74px;
        left: calc(50% - ((100vw - 100px) / 2));
        width: calc(100vw - 200px);

        margin: 0px;
        padding: 1rem 2rem;
        border: 0px;
        border-radius: 10px;

        box-shadow: 4px 4px 7px #000000;
        z-index: 100;
    }

    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    }

    h1 {
        margin: 0px;
        padding: 0px;
        width: 100%;
        text-align: center;
        font-size: 1.3rem;
    }

    .ship {
        height: 20px;
        width: 20px;
    }

    .food-group,
    .mine-group {
        height: 100%;

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

    .food {
        height: 20px;
        width: 20px;
    }

    .pipis {
        height: 15px;
        width: 20px;
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
    .black-to-red {
        filter: invert(14%) sepia(95%) saturate(2709%) hue-rotate(345deg)
            brightness(96%) contrast(103%);
    }
</style>
