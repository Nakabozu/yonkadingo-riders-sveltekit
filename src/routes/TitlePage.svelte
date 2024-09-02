<script lang="ts">
    import { onMount, tick } from "svelte";
    import { 
        showTempErrorMessage,
        errorMessage,
        setCookie,
        socket,
        roomCode,
        username,
        userClass,
        // Helper Functions
        transitionToNewPage,
        // Enums
        Classes,
        Pages,
    } from "../common/stores";
    import tripleCartoonWave from "../assets/triple-cartoon-wave.gif";

    let wantsToJoinGame = false;
    let desiredRoomNumber = -1;

    let pageHeight = 0;
    onMount(()=>{
        tick();
        pageHeight = document.body.offsetHeight;
        socket.on("connect_error", (err) => {
            $errorMessage = "Oh no!  We couldn't connect to the server!  Try coming back later."
            console.error(err);
        });
        socket.emit("user_joins_title_page");
    });

    const moveToClassPage = (userNameToSet: string, roomCodeToSet: number, userClassToSet: Classes) => {
        $username = userNameToSet;
        $roomCode = roomCodeToSet;
        $userClass = userClassToSet;
        
        setCookie("username", userNameToSet);
        setCookie("roomCode", String(roomCodeToSet));
        setCookie("userClass", String(userClassToSet));

        console.log(`${$username} connected to Room${roomCodeToSet} and became a ${Classes[userClassToSet]}`);
        transitionToNewPage(Pages.Class);
    }

    /* *********************************** *
    * WHERE ALL OF THE SWEET WEBHOOKS LIVE *
    * ************************************ */
    // MESSAGES I EMIT
    const create_room = () => {
        tick();
        pageHeight = document.body.offsetHeight;
        socket.emit('client_creates_room', $username, (newRoomCode: number, newClass: number) => {
            $roomCode = newRoomCode;
            $userClass = newClass;
            
            if(newRoomCode > 0){
                moveToClassPage($username, newRoomCode, newClass);
            }else{
                showTempErrorMessage("Weird, we couldn't start a new game for you.  Maybe try again in a couple of seconds?");
            }
        });
    }

    const connect_to_room = (requestedRoomCode: number) => {
        socket.emit("client_connects_to_room", $username, requestedRoomCode, (newClass: Classes)=>{
            console.log(`${$username} entered Room${requestedRoomCode} as a ${Classes[newClass]}`)
            if(newClass > 0) moveToClassPage($username, requestedRoomCode, newClass);
        });
    };

    socket.on("server_says_no_room", ()=>{
        console.log("Couldn't connect");
        showTempErrorMessage("That room is full or doesn't exist!");
    });

    socket.on("server_says_error_client_already_in_room", () => {
        console.log("Already in a room!");
        showTempErrorMessage("Hold up now.  One room per browser tab!  How'd you even manage this?");
    });

    socket.on("server_says_someone_has_that_name", () => {
        console.log("Duplicate name!");
        showTempErrorMessage("One of us has to change... Someone has your username already.");
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
        <button class="start-button" on:click={create_room}>START A GAME</button>
        <div class="join-game-section">
            <button class="join-button" on:click={()=>{if(!wantsToJoinGame){wantsToJoinGame = true}else{connect_to_room(desiredRoomNumber)}}}>{wantsToJoinGame ? "JOIN!" : "JOIN A GAME"}</button>
            {#if wantsToJoinGame}
                <input class="room-code-input" type="number" min={1} bind:value={desiredRoomNumber}/>
            {/if}
        </div>
        {#if $errorMessage}
            <strong>{$errorMessage}</strong>
        {/if}
    </nav>
    <span class="preload-assets">
        <img src={tripleCartoonWave} alt="Triple Wave Gif Preloader"/>
        0123456789
    </span>
</div>

<style>
    h1{
        margin-top: 50px;
        margin-bottom: 0px;
        
        text-align: center;
        color: white;
        font-size: 3.5rem;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: black;
    }

    h2{
        margin: 0px;

        text-align: center;
        color: white;
        font-size: 3rem;
        
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
        font-size: 2rem;
        padding: 0.25rem 1rem;
        font-family: inherit;
    }

    .title-buttons{
        z-index: 1;
        top: calc(50%);
        position: absolute;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 
        1fr 
        1fr;
        justify-content: center;
        align-items: center;
        row-gap: 1rem;
    }

    .join-game-section{
        display: flex;
    }

    .join-button{
        width: 100%;
    }

    .join-game-section input{
        margin-left: 10px;
    }

    input{
        font-size: 2rem;
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

    .preload-assets{
        display: flex;
        flex-direction: column;
        opacity: .05;
        position: fixed;
        top: -500px;
        left: -500px;

        font-family: "DSEG7";
    }
</style>