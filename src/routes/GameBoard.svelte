<script lang="ts">
    // Ahh, the gameboard.  Should always be at the top left of the screen when it's not the focus of the screen.
    // Each tile should be clickable to produce a popup of what is known about the tile.  Traps?  Weather?  Was the enemy ship spotted here and the party hasn't traveled over it? etc.
    import { Classes, classDescriptions, username, userClass } from "../common/stores";
    import Tile from "../common/GameComponents/Tile.svelte";
</script>

<div class="background">
    <h1>
        Gameboard
    </h1>
    <Tile/>
</div>

<style>
    .background{
        padding-top: 46px;

        background: rgba(141,215,247,1);
        margin: 0px;
        padding: 0px;

        height: 100vh;
    }
</style>