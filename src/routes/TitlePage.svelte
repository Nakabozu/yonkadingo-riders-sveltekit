<script lang="ts">
    import { onMount, tick } from "svelte";
    import { socket, roomCode, Pages, username, isTransitionPlaying, transitionToNewPage } from "../common/stores";

    let pageHeight = 0;
    onMount(()=>{
        tick();
        pageHeight = document.body.offsetHeight;
    });

    const onStart = () => {
        tick();
        pageHeight = document.body.offsetHeight;
        transitionToNewPage(Pages.Class);
        socket.emit('create_room', $username, (newRoomCode: number) => {$roomCode = newRoomCode;});
    }
</script>


<div class="background flex-column flex-align-center">
    <title>Yonkadingo Riders</title>
    <h1>Yonkadingo Riders</h1>
    <h2>Become a Yonkadingo Captain!</h2>
    <nav class="title-buttons">
        <input type="text" class="name-input" placeholder="Name" bind:value={$username}/>
        <button class="start-button" on:click={onStart}>START A GAME</button>
        <button class="start-button">JOIN A GAME</button>
    </nav>
</div>

<style>
    h1{
        margin: 0px;
        
        text-align: center;
        color: white;
        font-size: 6em;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: black;

        line-height: 1em;
    }

    h2{
        margin: 0px;

        color: white;
        font-size: 2em;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: black;
    }

    .background{
        padding-top: 46px;

        background: url("YonkadingoTitleImage.png") no-repeat center center fixed;
        margin: 0px;
        padding: 0px;

        height: 100vh;
    }

    button{
        font-size: 2em;
        padding: 0.25rem 1rem;
    }

    .title-buttons{
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
        row-gap: 1rem;
    }

    .name-input{
        font-size: 2em;
        border-radius: 10px;
        padding-left: 0.5rem;
    }

    
    .flex-column{
        display: flex;
        flex-direction: column;
    }

    .flex-align-center{
        align-items: center;
    }
</style>