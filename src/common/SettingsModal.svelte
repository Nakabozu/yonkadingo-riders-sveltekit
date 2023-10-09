<script lang="ts">
    import { onMount, tick } from "svelte";
    import { socket } from "../common/stores";
    let myDocument: Document | null = null;
    onMount(()=>{
        tick();
        myDocument = document;
    })

    const printConnectedUsers = () => {
        socket.emit('print_users', (activeUsers: any[]) => {
            console.log(activeUsers);
        });
    }
</script>

<h1>Settings</h1>
<label for="testRange">Option: </label>
<input type="range" min="1" max="100" value="50" id="testRange" class="slider">
<pre>
    Get rid of this eventually:
    I want the sliders to have a little yonkadingo as the icon and it swims when you move it.
</pre>
<button on:click={printConnectedUsers}>Print Users to Console</button>
<pre>
Your cookies:
{myDocument?.cookie}
</pre>


<style>
    pre{
        white-space: pre-wrap;
    }

    h1{
        margin: 0px;
        padding: 0px;
        width: 100%;
        text-align: center;
    }

    .slider{
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 100%; /* Full-width */
        height: 25px; /* Specified height */
        background: #d3d3d3; /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
    }

    /* Mouse-over effects */
    .slider:hover {
        opacity: 1; /* Fully shown on mouse-over */
    }

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #04AA6D; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

    .slider::-moz-range-thumb {
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #04AA6D; /* Green background */
        cursor: pointer; /* Cursor on hover */
    } 

</style>