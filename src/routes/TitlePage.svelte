<script lang="ts">
    import { onMount, tick } from "svelte";
    import { setCookie, socket, roomCode, Pages, username, isTransitionPlaying, transitionToNewPage } from "../common/stores";

    let wantsToJoinGame = false;
    let desiredRoomNumber = -1;
    let errorMessage = "";

    let pageHeight = 0;
    onMount(()=>{
        tick();
        pageHeight = document.body.offsetHeight;
        socket.on("connect_error", (err) => {
            errorMessage = "Oh no!  We couldn't connect to the server!  Try coming back later."
            console.error(err);
        });
        socket.emit("user_joins_title_page");
    });

    const showTempErrorMessage = (msg: string, time: number = 5000) => {
        errorMessage = msg;
        setTimeout(()=>{
            errorMessage = "";
        }, time)
    }

    /* *********************************** *
    * WHERE ALL OF THE SWEET WEBHOOKS LIVE *
    * ************************************ */
    // MESSAGES I EMIT
    const onStart = () => {
        tick();
        pageHeight = document.body.offsetHeight;
        socket.emit('client_creates_room', $username, (newRoomCode: number) => {
            console.log(`${$username} attempted to create Room${newRoomCode}`);
            $roomCode = newRoomCode;
            if(newRoomCode > 0){
                setCookie("username", $username);
                setCookie("roomCode", String(newRoomCode));
                
            }else{
                showTempErrorMessage("Weird, we couldn't start a new game for you.  Maybe try again in a couple of seconds?");
            }
        });
    }

    const connect_to_room = (roomNumber: number) => {
        socket.emit("client_connects_to_room", $username, roomNumber);
    };

    socket.on("server_says_no_room", ()=>{
        console.log("Couldn't connect");
        showTempErrorMessage("That room is full or doesn't exist!");
    });

    socket.on("server_says_error_client_already_in_room", () => {
        console.log("Already in a room!");
        showTempErrorMessage("Hold up now.  One room per browser tab!  How'd you even manage this?");
    });


    /* ************************ *
    * END OF THE SWEET WEBHOOKS *
    * ************************* */
</script>


<div class="background flex-column flex-align-center">
    <title>Yonkadingo Riders</title>
    <h1>Yonkadingo Riders</h1>
    <h2>Become a Yonkadingo Captain!</h2>
    <nav class="title-buttons">
        <input type="text" class="name-input" placeholder="Name" bind:value={$username}/>
        <button class="start-button" on:click={onStart}>START A GAME</button>
        <div class="join-game-section">
        <button class="start-button" on:click={()=>{if(!wantsToJoinGame){wantsToJoinGame = true}else{connect_to_room(desiredRoomNumber)}}}>{wantsToJoinGame ? "JOIN!" : "JOIN A GAME"}</button>
        {#if wantsToJoinGame}
            <input class="room-code-input" type="number" min={1} bind:value={desiredRoomNumber}/>
        {/if}
        </div>
        {#if errorMessage}
            <strong>{errorMessage}</strong>
        {/if}
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

    input{
        font-size: 2em;
        border-radius: 10px;
        padding-left: 0.5rem;
    }

    strong{
        color: red;
        text-shadow: 10px 5px 5px black;
    }

    .room-code-input{
        width: 10rem;
    }
    
    .flex-column{
        display: flex;
        flex-direction: column;
    }

    .flex-align-center{
        align-items: center;
    }
</style>