<script lang="ts">
    import { onMount, tick } from "svelte";
    import { ansiR, Classes, cT, socket, userClass, yonkadingo, type Yonkadingo,} from "../stores";
    import DsegNumber from "../Components/DsegNumber.svelte";

    let currentTab: Classes | null = Classes.Steward;
    onMount(() => {
        tick();
        currentTab = $userClass;
        // #region Server Websockets
        socket.on("server_updates_stats", (newStats: Yonkadingo) => {
            console.log(`${cT}server_updates_stats${ansiR}`, newStats)
            $yonkadingo = newStats;
        });
        // #endregion
    });
    /* ***************** *
     * MY SWEET WEBHOOKS *
     * ***************** */

</script>

<table>
    <thead>
        <tr>
            <th colspan="2">
                STATS
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>
                HP
            </th>
            <td>
                <DsegNumber num={$yonkadingo.hp} opacity={0.15}/>
            </td>
        </tr>
        <tr>
            <th>
                Food
            </th>
            <td>
                <DsegNumber num={$yonkadingo.food} opacity={0.15}/>
            </td>
        </tr>
        <tr>
            <th>
                Pellets
            </th>
            <td>
                <DsegNumber num={$yonkadingo.pellets} opacity={0.15}/>
            </td>
        </tr>
    </tbody>
</table>

<style>
table{
    margin: 5px;
    border: 2px double black;
}
td{
    border: 2px solid azure;
}
th, td{
    padding: 3px;
    text-align: right;
}
</style>