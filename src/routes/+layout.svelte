<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { socket, cookieData, isTransitionPlaying, transitionDuration } from "../common/stores";
    import SettingsModal from '../common/SettingsModal.svelte';

    let isSettingsDialogOpen: boolean = false;
    let settingsModalElement: HTMLDialogElement;
    let settingsModalWidth: number | undefined;
    let settingsModalHeight: number | undefined;

    let pageHeight = 0;

    onMount(async () => {
        $cookieData = document.cookie;

        await tick();
        pageHeight = document.body.offsetHeight;
        settingsModalWidth = settingsModalElement.offsetWidth;
        settingsModalHeight = settingsModalElement.offsetHeight;
    });

    const openSettingsModal = async () => {
        isSettingsDialogOpen = !isSettingsDialogOpen;
        // Must wait for dialog to be rendered before updating width and height or it will simply be 0 every time.
        await tick();
        settingsModalWidth = settingsModalElement.offsetWidth;
        settingsModalHeight = settingsModalElement.offsetHeight;
    }

    //NOTE: THE SOUND ENGINE NEEDS TO GO IN HERE
</script>

<input
    type="image"
    src="settings.svg"
    alt="Settings"
    class="settings-icon"
    on:click={openSettingsModal}/>
<dialog
    id="settings-modal"
    bind:this={settingsModalElement}
    open={isSettingsDialogOpen}
    style={`top: calc(50% - ${Math.floor((settingsModalHeight ?? 0)/2)}px); left: calc(50% - ${Math.floor((settingsModalWidth ?? 0)/2)}px);`}>
    <SettingsModal/>
    Your cookie data: {$cookieData}
</dialog>

<slot />

{#if $isTransitionPlaying}
    <div class="transition" style={`top: ${pageHeight + 160}px; animation-duration: ${transitionDuration}s;`}>
        <div class="transition-text">
            LOADING...
        </div>
        <div class="transition-background"></div>
    </div>
{/if}

<style>
    :global(body){
        /* */ overflow-y: hidden; /* */
    }

    .settings-icon{
        position: absolute;
        top: 1em;
        right: 1em;
    }

    dialog{
        position: absolute;
        width: calc(100vw - 200px);

        margin: 0px;
        padding: 1em 2em;
        border: 0px;
        border-radius: 10px;

        box-shadow: 4px 4px 7px #000000;
    }

    dialog::backdrop{
        background-color: rgba(0, 0, 0, 0.5);
    }

    .transition{
        position: absolute;
        width: 100vw;
        height: calc(100vh + 200px);
        text-align: center;
        vertical-align: middle;
        
        color: gold;
        font-size: 2em;
        font-weight: 600;
        font-family: 'Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: black;

        background-color: transparent;  /* Fully transparent */

        animation-name: bottomToTop;
        animation-timing-function: linear;
    }

    .transition-text{
        position: absolute;
        top: -160px;

        height: 160px;
        width: 100%;
        padding-top: 1em;

        background-color: transparent;  /* Fully transparent */
        background-image: url("../assets/triple-cartoon-wave.gif");
        background-repeat: repeat-x;
        background-position: top;
    }

    .transition-background{
        background: rgba(141,215,247,1);
        height: 100%;
    }

    @keyframes bottomToTop {
        50% {top: -160px; opacity: 1;}
        100% {top: -160px; opacity: 0;}
    }

</style>