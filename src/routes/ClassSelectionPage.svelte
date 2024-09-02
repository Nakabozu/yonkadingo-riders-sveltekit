<script lang="ts">
    import { onMount, tick } from "svelte";
    import {
        socket,
        username,
        roomCode,
        Classes,
        classDescriptions,
        userClass,
        errorMessage,
        showTempErrorMessage,
    } from "../common/stores";

    let classNav: HTMLDivElement;
    let classNavHeight: string = "0px";

    // THIS MUST BE KEPT IN THE SAME ORDER AS THE CLASSES TURN ORDER
    type ClassDetailsType = {
        steward: string;
        bosun: string;
        topman: string;
        helmsman: string;
        gunner: string;
    };
    let classDetails: ClassDetailsType = {
        steward: "",
        bosun: "",
        topman: "",
        helmsman: "",
        gunner: "",
    };

    /* *********************************** *
     * WHERE ALL OF THE SWEET WEBHOOKS LIVE *
     * ************************************ */
    onMount(() => {
        tick();
        socket.emit("user_leaves_title_page");
        setClassNavHeight();

        window.addEventListener("resize", setClassNavHeight);

        socket.emit("client_requests_class_details", (newClassDetails: any) => {
            console.log(
                "Here are the class details you ordered:",
                newClassDetails
            );
            classDetails = newClassDetails;
        });

        return () => {
            window.removeEventListener("resize", setClassNavHeight);
        };
    });

    const setClassNavHeight = () => {
        classNav = document.getElementById("options-content") as HTMLDivElement;
        classNavHeight = classNav.scrollHeight + "px";
    };

    const getClassButtonType = (userToCheck: string): string => {
        if (userToCheck === $username) {
            return "class-green";
        } else if (userToCheck !== "") {
            return "class-red";
        } else {
            return "";
        }
    };

    const getUserOfClass = (nameOfClass: string | number) => {
        if (typeof nameOfClass === "number") {
            // @ts-ignore
            return classDetails[
                String(Classes[nameOfClass]).toLocaleLowerCase()
            ];
        }
        // @ts-ignore
        return classDetails[String(nameOfClass).toLocaleLowerCase()];
    };

    /* ***************** *
     * MY SWEET WEBHOOKS *
     * ***************** */
    socket.on("server_gives_class_updates", (newClassArray) => {
        console.log("newClassArray", newClassArray);
        classDetails = newClassArray;
        // TODO: Improve this.  It's super hacky and doesn't work if the object arrives in an unexpected order.
        Object.keys(classDetails).forEach((nameOfClass: string, index: number) => {
            if($username === getUserOfClass(nameOfClass)){
                $userClass = index+1;
            }
        });
    });

    socket.on("server_says_game_starting", (gameToStart) => {
        console.log("Your game has been served", gameToStart);
    });

    // MESSAGES I EMIT
    const selectClass = (desiredClass: Classes) => {
        console.log(`Yee want be a ${Classes[desiredClass]}?`);
        const currentUserOfClass = getClassButtonType(getUserOfClass(Classes[desiredClass]));
        if (currentUserOfClass === "class-green" || currentUserOfClass === "") {
            socket.emit("client_selects_a_class", desiredClass, (errMsg: string) => {
                if (errMsg.length > 0) {
                    console.error(errMsg);
                    showTempErrorMessage(errMsg);
                }
            });
        } else if (currentUserOfClass === "class-red") {
            console.log(`Yee cain't replace ${getUserOfClass(desiredClass)} as ${Classes[desiredClass]}!!!`);
        }
    };

    const startGame = () => {
        socket.emit("client_starts_game");
    };

    /* ************************ *
     * END OF THE SWEET WEBHOOKS *
     * ************************* */
</script>

<div class="background flex-column flex-align-center">
    <header>
        YOUR ROOM CODE IS: {$roomCode}
    </header>

    <div
        id="options-content"
        class="options-content"
        style="--options-content-height: {classNavHeight}"
    >
        <nav>
            <h2>Select your class</h2>
            <div class="button-container">
                {#each Object.keys(classDetails) as nameOfClass, index}
                    <div
                        class="class-button-and-user flex-column flex-align-center"
                    >
                        <button
                            class={`flex-row class-button ${getClassButtonType(
                                getUserOfClass(nameOfClass)
                            )}`}
                            on:click={() => {
                                selectClass(index + 1);
                            }}
                        >
                            <img
                                src={`../../src/assets/${nameOfClass.toLocaleLowerCase()}-icon.svg`}
                                alt={`${nameOfClass} Icon`}
                            />{nameOfClass}
                        </button>
                        <span
                            >{getUserOfClass(nameOfClass)
                                ? getUserOfClass(nameOfClass)
                                : "\u00A0"}</span
                        >
                    </div>
                {/each}
            </div>
        </nav>
        {#if $userClass}
            <details>
                <summary>About the {Classes[$userClass]}</summary>
                {classDescriptions[
                    String(Classes[$userClass]).toLocaleLowerCase()
                ]}
            </details>
        {/if}

        <button on:click={startGame}>SET SAIL!</button>
        <strong>{$errorMessage}</strong>
    </div>
</div>

<style>
    .background {
        padding-top: 46px;

        background: url("YonkadingoTitleImage.png") no-repeat center center
            fixed;
        margin: 0px;
        padding: 0px;

        height: 100vh;
    }

    header {
        margin-top: 3rem;
        color: aliceblue;

        text-align: center;
        font-size: 3.5rem;
        font-weight: 700;
        -webkit-text-stroke-width: 1px;
        -webkit-text-stroke-color: black;
    }

    .options-content {
        z-index: 1;

        position: absolute;
        top: calc(50vh - calc(var(--options-content-height) / 2));

        display: flex;
        flex-flow: column nowrap;

        align-items: center;
        justify-content: center;
    }

    nav {
        display: flex;
        flex-direction: column;

        gap: 1rem;
    }

    nav h2 {
        align-self: center;
        font-size: 3rem;
        font-weight: 600;
        font-family: "Freebooter", "Gothic Medium", "Arial Narrow", Arial,
            sans-serif;
    }

    .button-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;

        gap: 1rem;
    }

    .class-button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;

        font-size: 2.5rem;
        padding: 0.25rem 1rem;
        text-transform: capitalize;

        background-color: aliceblue;

        border: 2px solid black;
        border-radius: 6px;

        cursor: pointer;
    }

    @media screen and (max-width: 400px) {
        .button-container {
            display: grid;
        }

        .class-button-and-user {
            width: 100%;
        }

        .class-button {
            width: 100%;
        }
    }
    
    .class-green {
        background-color: aquamarine;
    }

    .class-red {
        background-color: lightcoral;
    }

    .class-button img {
        width: 2rem;
        height: 2rem;
        margin-right: 0.5rem;
    }

    span {
        font-size: 1.2rem;
        text-shadow: 2px 2px 3px #fff, -2px -2px 3px #fff, 2px -2px 3px #fff,
            -2px 2px 3px #fff;
    }

    button {
        margin-top: 0.25rem;
        padding: 5px 10px;
        font-size: large;
        box-shadow: 10px 5px 5px black;
    }

    details {
        margin-top: 1rem;
        padding: 0.5rem 1.5rem;
        background-color: aliceblue;

        width: 50%;
        min-width: 200px;

        border: 2px solid black;
        border-radius: 10px;

        font-size: clamp(1.25em, 1rem, 1pt);
    }

    details summary {
        text-transform: capitalize;
    }

    strong {
        color: red;
    }

    .flex-row {
        display: flex;
        flex-direction: row;
    }

    .flex-column {
        display: flex;
        flex-direction: column;
    }

    .flex-align-center {
        align-items: center;
    }
</style>
