<script lang="ts">
    // Ahh, the gameboard.  Should always be at the top left of the screen when it's not the focus of the screen.
    // Each tile should be clickable to produce a popup of what is known about the tile.  Traps?  Weather?  Was the enemy ship spotted here and the party hasn't traveled over it? etc.
    import { username, Classes, classDescriptions, selectedClass } from "../common/stores";
    
</script>

<div class="background flex-column flex-align-center">
    <h1>
        Gameboard
    </h1>
</div>

<style>
    .background{
        padding-top: 46px;

        background: rgba(141,215,247,1);
        margin: 0px;
        padding: 0px;

        height: 100vh;
    }
    
    header{
        margin-top: 3rem;

        color: gold;
        font-size: 3.5em;
        font-weight: 700;
        font-family: 'Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: black;

    }

    nav{
        display: flex;
        flex-direction: column;

        margin-top: 3em;
        gap: 1em;
    }

    nav h2{
        align-self: center;

        font-weight: 600;

        font-family: 'Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    }

    .button-container{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;

        gap: 1em;
    }

    label{
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;

        font-size: 2em;
        padding: 0.25rem 1rem;
        text-transform: capitalize;

        background-color: aliceblue;

        border: 2px solid black;
        border-radius: 6px;

        cursor: pointer;
    }

    input[type="radio"]:checked+label{
        background-color: aquamarine;
    }

    label img{
        width: 1em;
        height: 1em;
        margin-right: 0.5em;
    }

    input[type="radio"] {
        appearance: none;
        -webkit-appearance: none;
        background-color: #fff;
        margin: 0;
    }

    button{
        margin-top: 1rem;
        padding: 5px 10px;
        font-size: large;
        box-shadow: 10px 5px 5px black;
    }

    details{
        margin-top: 3em;
        padding: 1em 3em;
        background-color: aliceblue;

        width: 50%;
        min-width: 200px;

        border: 2px solid black;
        border-radius: 10px;
    }

    details summary{
        text-transform: capitalize;
    }

    .flex-row{
        display: flex;
        flex-direction: row;
    }

    .flex-column{
        display: flex;
        flex-direction: column;
    }

    .flex-align-center{
        align-items: center;
    }
</style>