<script lang="ts">
    import { onMount, tick } from "svelte";
    import { isChatDisplayed, isShowingChat, socket, username } from "../common/stores";
    let messages: any[] = [];
    let userInput = "";

    let chatTextBoxObj: HTMLTextAreaElement;
    onMount(()=>{
        tick();
        if($isShowingChat){
            chatTextBoxObj = document.getElementById("chat-text-box") as HTMLTextAreaElement;
            resizeTextbox();
        }
    })

    const resizeTextbox = () => {
        chatTextBoxObj.style.height = "1px";
        chatTextBoxObj.style.height = (chatTextBoxObj.scrollHeight)+"px";
    }

    const onKeyUp = (e: KeyboardEvent) => {
        if(String(e.key).toLowerCase() === "enter"){
            sendMessage();
        }if(String(e.key).toLowerCase() === "escape"){
            clearChat();
        }
        resizeTextbox();
    }

    const sendMessage = () => {
        const trimmedInput = userInput.trim();
        if(trimmedInput){
            socket.emit("client_sends_chat_message", $username, trimmedInput);
            userInput = "".trim();
            setTimeout(() => { if(chatTextBoxObj) {
                chatTextBoxObj.select();
                resizeTextbox();}
            }, 50); 
        }
    }

    const clearChat = () => {
        userInput = "";
        messages = [];
    }

    socket.on("server_broadcasts_msg", (user, msg)=>{
        console.log(`${user} said ${msg}`);
        if(messages.length >= 5){
            messages.pop();
        }
        
        messages.splice(0, 0, {user, msg});
        messages = messages;
    });
</script>
{#if $isChatDisplayed}
    {#if $isShowingChat}
        <section>
            <form>
                <textarea 
                    id="chat-text-box"
                    bind:value={userInput}
                    on:keyup={onKeyUp}
                />
                <button on:click={sendMessage}>Send</button>
            </form>
            <article>
                {#each messages as msg}
                    <div><strong>{msg.user}</strong>: {msg.msg}</div>
                {/each}
            </article>
            <button class="close-button" on:click={()=>{$isShowingChat = false}}>X</button>
        </section>
    {:else}
        <section>
            <button class="show-chat-button" on:click={()=>{$isShowingChat = true}}>↑ Open Chat ↑</button>
        </section>
    {/if}
{/if}

<style>
    section{
        display: flex;
        flex-flow: column-reverse nowrap;
        position: fixed;
        bottom: 0px;

        max-height: 30vh;
        width: 100%;
        min-width: 200px;

        overflow: hidden;
    }

    article{
        overflow-x: hidden;
        overflow-y: scroll;
    }

    form{
        display: flex;
        flex-direction: row;

        gap: 5px;
        max-width: 100%;
        width: 100%;
    }

    div{
        background: #FFFFFFA0;
        padding: 0px 2px;
    }

    textarea{
        font-size: inherit;
        resize: vertical;
    }

    button{
        font-size: inherit;
        padding: 0.1em 0.2em;
    }

    .show-chat-button{
        width: 100%;
        font-size: medium;
        border-radius: 0px;
        border: none;
    }

    .close-button{
        position: fixed;
        bottom: 10px;
        right: 10px;
        color: red;
    }
</style>