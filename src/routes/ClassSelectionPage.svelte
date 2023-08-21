<script lang="ts">
    import { username, Classes, classDescriptions, selectedClass } from "../common/stores";
</script>

<div class="background flex-column flex-align-center">
    <header>
        YOUR ROOM CODE IS: 
    </header>

    <nav>
        <h2>Select your class</h2>
        <div class="button-container">
            {#each Classes as className}
                <div class="flex-column flex-align-center">
                    <div class="flex-row">
                        <input type="radio" bind:group={$selectedClass} id={className} name="Class" style={`--className: url(../../src/assets/${className}-icon.svg)`} value={className}/>
                        <label for={className}><img src={`../../src/assets/${className}-icon.svg`} alt={`${className} Icon`}/>{className}</label>
                    </div>
                    {#if $selectedClass === className}
                        {$username ?? "&nbsp"}
                    {/if}
                </div>
            {/each}
        </div>
    </nav>
    {#if $selectedClass}
    <details>
        <summary>About the {$selectedClass}</summary>
        {classDescriptions[$selectedClass]}
    </details>
    {/if}
</div>

<style>
    .background{
        padding-top: 46px;

        background: url("YonkadingoTitleImage.png") no-repeat center center fixed;
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