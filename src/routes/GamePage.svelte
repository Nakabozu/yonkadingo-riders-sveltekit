<script>
    import {socket} from "../common/stores";

    import GameBoard from '../common/GameComponents/GameBoard.svelte'
    import ActionTabs from '../common/GameComponents/class/ActionTabs.svelte';

    /* *********************************** *
     * WHERE ALL OF THE SWEET WEBHOOKS LIVE *
     * ************************************ */

     /* *********************************** *
     * Note to self: @3d-dice/dice-box might be worth downloading
     *  *
     * ************************************ */


</script>

<div class="background">
    <GameBoard/>
    <ActionTabs/>
</div>

<style>
    .background{
        padding-top: 46px;

        background: rgba(141,215,247,1);
        padding: 0px;

        height: 100vh;
    }
</style>