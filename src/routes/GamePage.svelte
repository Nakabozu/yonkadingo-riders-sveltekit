<script>
    import {ansiR, buB, buT, cT, mT, socket, yonkadingo} from "../common/stores";

    import GameBoard from '../common/GameComponents/GameBoard.svelte'
    import ActionTabs from '../common/GameComponents/class/ActionTabs.svelte';
    import ScoreBoard from "../common/GameComponents/ScoreBoard.svelte";
    /* *********************************** *
     * WHERE ALL OF THE SWEET WEBHOOKS LIVE *
     * ************************************ */
     socket.on("server_updates_yonka", (newYonka) => {
        console.log(
            `${mT}The server updated the ${buT}Yonkadingo${ansiR}`, 
            yonkadingo
        )
        $yonkadingo = newYonka;
    });

     /* *********************************** *
     * Note to self: @3d-dice/dice-box might be worth downloading
     *  *
     * ************************************ */


</script>

<div class="background">
    <GameBoard/>
    <div class="score-and-action">
        <ScoreBoard/>
        <ActionTabs/>
    </div>
</div>

<style>
    .background{
        padding-top: 46px;

        background: rgba(141,215,247,1);
        padding: 0px;

        height: 100vh;
    }

    .score-and-action{
        display: flex;
        flex-direction: row;
    }
</style>