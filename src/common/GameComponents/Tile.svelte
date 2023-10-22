<script lang="ts">
    // Ahh, the gameboard.  Should always be at the top left of the screen when it's not the focus of the screen.
    // Each tile should be clickable to produce a popup of what is known about the tile.  Traps?  Weather?  Was the enemy ship spotted here and the party hasn't traveled over it? etc.
    import { Classes, classDescriptions, username, userClass, ResourceTypes, Weathers } from "../stores";
    export let isRevealedVal: boolean = false;
    export let hasAI: boolean = false;
    export let hasMineVal: boolean = false;
    export let weatherVal: Weathers | null = Weathers.Nothing;
    export let resourceTypeVal: ResourceTypes = ResourceTypes.Food;
    export let resourceCountVal: number = 0;
</script>

<div class="background">
    <h1>
        Tile
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
</style>