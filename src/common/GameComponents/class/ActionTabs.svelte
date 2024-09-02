<script lang="ts">
    import { onMount, tick } from "svelte";
    import { ansiR, buT, Classes, cT, currentTurn, socket, userClass } from "../../stores";

    import StewardActions from "./StewardActions.svelte";
    import BosunActions from "./BosunActions.svelte";
    import TopmanActions from "./TopmanActions.svelte";
    import HelmsmanActions from "./HelmsmanActions.svelte";
    import GunnerActions from "./GunnerActions.svelte";
    let currentTab: Classes | null = Classes.Steward;
    onMount(() => {
        tick();
        currentTab = $userClass;
        // #region Server Websockets
        socket.on("server_updates_class_turn", (newClass: Classes) => {
            console.log(`${cT}It's now the ${buT}${Classes[newClass]}${cT}'s turn.${ansiR}`)
            currentTab = newClass;
            $currentTurn = newClass;
        });
        // #endregion
    });

    const switchTab = (newTab: number) => {
        currentTab = newTab;
    }
    /* ***************** *
     * MY SWEET WEBHOOKS *
     * ***************** */

</script>

<ul>
    {#each Object.keys(Classes).filter(x => isNaN(parseInt(x))) as nameOfClass, index}
        <li>
            <a class={currentTab === index+1 ? "underline" : ""} on:click={()=>{switchTab(index+1)}}>{nameOfClass}</a>
        </li>
    {/each}
</ul>
{#if currentTab === Classes.Steward}
    <StewardActions />
{:else if currentTab === Classes.Bosun}
    <BosunActions />
{:else if currentTab === Classes.Topman}
    <TopmanActions />
{:else if currentTab === Classes.Helmsman}
    <HelmsmanActions />
{:else if currentTab === Classes.Gunner}
    <GunnerActions />
{:else}
    <h1>You must be an admin, huh?</h1>
{/if}

<style>
    ul{
        list-style-type: none;

        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-evenly;

        gap: 10px;

        margin: 10px 0px;
    }

    ul .underline{
        text-decoration: underline;
    }

    li{
        list-style-type: none;


    }

    a{
        cursor: pointer;
    }
</style>