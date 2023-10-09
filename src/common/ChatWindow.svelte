<script lang="ts">
    import { onMount, tick } from "svelte";
    import { socket, username } from "../common/stores";
    let messages: any[] = [];
    let userInput = "";
    const sendMessage = () => {
        if(userInput){
            socket.emit("client_sends_chat_message", $username, userInput);
            userInput = "";
        }
    }

    socket.on("server_broadcasts_msg", (user, msg)=>{
        console.log(`${user} said ${msg}`);
        if(messages.length >= 5){
            messages.shift();
        }
        messages.push({user, msg});
        messages = messages;
    });
</script>

<section>
    {#each messages as msg}
        <div><strong>{msg.user}</strong>: {msg.msg}</div>
    {/each}
    <form>
        <input 
        type="text"
        bind:value={userInput}
        on:keypress={(e) => {if(String(e.key).toLowerCase() === "enter"){
            sendMessage();
        }}}/>
        <button on:click={sendMessage}>Send</button>
    </form>
</section>


<style>
    section{
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: 10vh;
        left: 5vw;

        max-height: 50vh;
        width: 10vw;
    }

    form{
        display: flex;
        flex-direction: row;

        gap: 5px;
    }

    div{
        background: #FFFFFFA0
    }
</style>