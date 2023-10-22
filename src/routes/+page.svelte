<script lang="ts">
    // NOTE: I've decided to make this a single page application so certain processes like the sound engine can run
    //       between rerenders and such.

    // NPM Stuff
    import { onMount, tick } from "svelte";
    // State variable management
    import { Pages, currentPage } from "../common/stores";
    // Svelte Components
    import TitlePage from "./TitlePage.svelte";
    import ClassSelectionPage from "./ClassSelectionPage.svelte";
    import GameBoard from "./GameBoard.svelte";
</script>

{#if $currentPage === Pages.Title}
    <TitlePage />
{:else if $currentPage === Pages.Class}
    <ClassSelectionPage/>
{:else if $currentPage === Pages.Game}
    <GameBoard/>
{/if}

<style>

</style>