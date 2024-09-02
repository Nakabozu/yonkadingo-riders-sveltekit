<script lang="ts">
    import { onMount, tick } from 'svelte';
    import { userId, socket, getCookie, setCookie, isTransitionPlaying, transitionDuration, isSettingsDialogOpen } from "../common/stores";
    import SettingsModal from '../common/SettingsModal.svelte';
    import ChatWindow from '../common/ChatWindow.svelte';
    import TreasureHunt from '../assets/TreasurehuntPersonalUseRegular-3zKgp.otf';
    import TreasureMap from "../assets/TreasureMapDeadhand-yLA3.ttf";

    let settingsModalElement: HTMLDialogElement;
    let settingsModalWidth: number | undefined;
    let settingsModalHeight: number | undefined;

    let pageHeight = 0;

    onMount(async () => {
        await tick();
        pageHeight = document.body.offsetHeight;
        settingsModalWidth = settingsModalElement.offsetWidth;
        settingsModalHeight = settingsModalElement.offsetHeight;

        const oldSocketId = getCookie("id");

        if(oldSocketId){
            socket.emit("client_says_user_already_has_id", oldSocketId, (userDetails: any)=>{

            });
        }else{
            socket.on("server_gives_client_id", (newSocketId) => {
                setCookie("id", newSocketId);
                $userId = newSocketId;
            });
        }
    });

    const openSettingsModal = async () => {
        $isSettingsDialogOpen = !$isSettingsDialogOpen;
        // Must wait for dialog to be rendered before updating width and height or it will simply be 0 every time.
        await tick();
        settingsModalWidth = settingsModalElement.offsetWidth;
        settingsModalHeight = settingsModalElement.offsetHeight;
    }

    //TODO: THE SOUND ENGINE NEEDS TO GO IN HERE
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
    open={$isSettingsDialogOpen}
    style={`top: calc(50% - ${Math.floor((settingsModalHeight ?? 0)/2)}px); left: calc(50% - ${Math.floor((settingsModalWidth ?? 0)/2)}px);`}>
    <SettingsModal/>
</dialog>
<ChatWindow />

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
    
    @font-face {
        font-family: "TreasureHunt";
        src: url("../assets/TreasurehuntPersonalUseRegular-3zKgp.otf") format('opentype');
    }

    @font-face {
        font-family: "TreasureMap";
        src: url("../assets/TreasureMapDeadhand-yLA3.ttf") format('truetype');
    }

    @font-face {
        font-family: "Freebooter";
        src: url("../assets/Freebooter-6yn1.ttf") format('truetype');
    }

    @font-face {
        font-family: "Freebooter";
        src: url("../assets/FreebooterItalic-5Xlv.ttf") format('truetype');
        font-style: italic;
    }

    @font-face{
        font-family: "DSEG7";
        src: url('../assets/DSEG7Classic-Regular.ttf') format('truetype');
    }
    /** For Root EM (REM) values, HTML is the ROOT element of any web document, which affects "rem" css values.
     ** FUN FACT WITH NAK! **: EM, otherwise known as em-quads, em-squares, mutton-quads, or mutton-squares 
            was the size of the capital M character in printing presses, because capital M (pronounced "em") 
            was the largest glyph in the printing press, and could be a good reference for the max characters on any given line.
    */
    :global(html){
        font-size: calc(0.5em + 1vw);
        font-family: "Freebooter", Arial, Helvetica, sans-serif;
    }
    
    :global(body){
        /* */ overflow-y: hidden; /* */
    }

    :global(h1){
        font-family: "TreasureHunt", Arial, Helvetica, sans-serif;
    }

    :global(h2, h3, h4, h5, h6){
        font-family: "TreasureMap", Arial, Helvetica, sans-serif;
        text-shadow: 2px 2px 3px #fff, -2px -2px 3px #fff, 2px -2px 3px #fff, -2px 2px 3px #fff;
    }

    :global(*){
        font-size: inherit;
        font-family: inherit;
        margin: 0px;
        padding: 0px;
    }

    .settings-icon{
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 10;
    }

    dialog{
        position: absolute;
        width: calc(100vw - 200px);

        margin: 0px;
        padding: 1rem 2rem;
        border: 0px;
        border-radius: 10px;

        box-shadow: 4px 4px 7px #000000;
        z-index: 100;
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
        font-size: 2rem;
        font-weight: 600;
        font-family: 'Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: black;

        background-color: transparent;  /* Fully transparent */

        animation-name: bottomToTop;
        animation-timing-function: linear;

        z-index: 100;
    }

    .transition-text{
        position: absolute;
        top: -160px;

        height: 160px;
        width: 100%;
        padding-top: 1rem;

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