<script lang="ts">
    /*
     * TODO: I could make this more efficient by doing one row of 8s
     * and 1 row of numbers instead of each number having its own 8.
     */
    //
    

    export let num = 0;
    export let opacity = 0.1;

    const getDigitArray = (number: number): number[] => {
        let finalNumArray = [];

        while(number > 0){
            finalNumArray.push(Math.floor(number % 10));
            number = Math.floor(number / 10);
        }

        return finalNumArray.reverse();
    }
</script>
<span>
    {#each getDigitArray(num) as number}
        <div class="dseg">
            <div class="dseg-background" style="--opa: {opacity}">8</div>
            {number}
        </div>
    {/each}
</span>

<style>
    span{
        display: inline flex;
    }

    .dseg{
        position: relative;
        font-family: "DSEG7";
        animation-name: flicker-light;
        animation-duration: 60s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    .dseg .dseg-background{
        color: black;
        position: absolute;
        opacity: var(--opa);
        user-select: none;
        animation-name: flicker;
        animation-duration: 60s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @keyframes flicker{
        90%{
            opacity: var(--opa);
        }
        99.3%{
            opacity: 0%;
        }
        99.4%{
            opacity: var(--opa);
        }
        99.5%{
            opacity: 0%;
        }
        99.6%{
            opacity: 90%;
        }
        99.7%{
            opacity: 0%;
        }
        99.8%{
            opacity: 74%;
        }
        99.9%{
            opacity: 0%;
        }
        100%{
            opacity: var(--opa);
        }
    }

    @keyframes flicker-light{
        96%{
            opacity: 100%;
        }
        99.3%{
            opacity: 25%;
        }
        99.4%{
            opacity: 100%;
        }
    }

</style>