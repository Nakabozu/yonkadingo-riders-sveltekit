<script lang="ts">
    // NOTE: I've decided to make this a single page application so certain processes like the sound engine can run
    //       between rerenders and such.

    // NPM Stuff
    import { onMount, tick } from "svelte";
    import { io } from "socket.io-client";
    // State variable management
    import { Pages, currentPage } from "../common/stores";
    // Svelte Components
    import TitlePage from "./TitlePage.svelte";
    import ClassSelectionPage from "./ClassSelectionPage.svelte";
</script>

{#if $currentPage === Pages.Title}
    <TitlePage />
{:else if $currentPage === Pages.Class}
    <ClassSelectionPage/>
{/if}

<style>

</style>