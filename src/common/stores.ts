// This is more than a store really, it's where a lot of the general logic, variables, and constants of the app will live.
import { writable, readable } from "svelte/store";
import { io } from "socket.io-client";

// The Websocket
export const socket = io(
    "ws://localhost:5100"
    //"wss://134.209.222.229:5100/"
);

// #region Constants and Enums

// ANSI Colors
export const bT = "\x1b[30m";
export const rT = "\x1b[31m";
export const gT = "\x1b[32m";
export const yT = "\x1b[33m";
export const buT = "\x1b[34m";
export const mT = "\x1b[35m";
export const cT = "\x1b[36m";
export const wT = "\x1b[37m";
export const bB = "\x1b[40m";
export const rB = "\x1b[41m";
export const gB = "\x1b[42m";
export const yB = "\x1b[43m";
export const buB = "\x1b[44m";
export const mB = "\x1b[45m";
export const cB = "\x1b[46m";
export const wB = "\x1b[47m";
export const ansiR = "\x1b[00m";

export enum Pages {
    Title = 1,
    Class,
    Game,
}

/**
 * THESE MUST BE KEPT IN THE SAME ORDER AS THE TURN ORDER AND THE SAME AS IT IS IN THE WEBSOCKETS
 *
 * Current order: Steward (1) -> Bosun (2) -> Topman (3) -> Helmsman (4) -> Gunner (5)
 */
export enum Classes {
    Steward = 1,
    Bosun,
    Topman,
    Helmsman,
    Gunner,
}

/**
 * The GameActions are sent to the `client_performs_action` message's callback.
 * They are interpreted by the backend to perform a single player's move in the game.
 */
export enum GameActions {
    // Global Actions
    GlobalPass = 1,
    // Helmsman Actions
    HelmsmanMove,
    // Bosun Actions
    BosunDetect,
    BosunReduceFood,
    BosunReducePellets,
    // Topman Actions
    TopmanReveal,
    // Gunner Actions
    GunnerMine,
    GunnerFire,
    GunnerDodge,
    // Steward Actions
    StewardBuff,
}

export enum Weathers {
    Nothing = 1, //
    Tailwind, // 💨
    Headwind, // 🐌
    TuckedAway, // 😶‍🌫️
    WideOpen, // 🎯
    ClearSkies, // ☀️
    DenseFog, // ⛅
    CalmWaters, // ⛵
    RoughSeas, // 🌊
    AmpleTime, // ⏳
    RushJob, // ⏱
    FeedingFrenzy, // 🤤
    Famine, // 🍽
    FullMoon, // 🌕
    NewMoon, // 🌑
    NiceSprites, // 🧚
    ScaryMonsters, // 👿
}

export enum LaserDirections {
    North = 1,
    East,
    South,
    West,
}

export const weatherIcons: string[] = [
    "ICONS START AT 1", // If this one shows up, you made a mistake
    "\u00A0", // Nothing
    "💨", // Tailwind
    "🐌", // Headwind
    "😶‍🌫️", // Tucked Away
    "🎯", // Wide Open
    "☀️", // Clear Skies
    "⛅", // Dense Fog
    "🌅", // Calm Waters
    "🌊", // RoughSeas
    "⏳", // AmpleTime
    "⏱", // RushJob
    "🤤", // FeedingFrenzy
    "🍽", // Famine
    "🌕", // FullMoon
    "🌑", // NewMoon
    "🧚", // NiceSprites
    "👿", // ScaryMonsters
];

export enum ResourceTypes {
    Food = 0,
    Pellets,
}

export type GameBoardTile = {
    isRevealed: boolean;
    isVisited: boolean;
    hasAI: boolean;
    hasYonka: boolean;
    hasMine: boolean;
    weather: Weathers | null;
    resourceType: ResourceTypes;
    resourceCount: number;
};

export type Coordinate = {
    row: number;
    column: number;
};

export type Yonkadingo = {
    location: Coordinate;
    hp: number;
    food: number;
    pellets: number;
    isDodging: boolean; // If the yonka is dodging, they can pass through a mine for free
    extraMoves: number; // If the yonka passed over a tailwind tile, they get extra moves
    lastTilesMoved: Coordinate[]; // Where the yonkadingo previously traveled over
};

export const classDescriptions: any = {
    steward:
        "The STEWARD keeps the crew happy by helping!  You choose who to buff!",
    bosun: "The BOSUN manages rigging and cargo!  You choose resource expenditure!",
    topman: "The TOPMAN tells of what lies ahead!  You choose what to reveal!",
    helmsman:
        "The HELMSMAN steers the ship to victory!  You choose where to go!",
    gunner: "The GUNNER is in charge of weaponry!  You choose how and when to attack!",
};
// #endregion

// #region Helper Functions
export const getCookie = (name: string) => {
    function escape(s: string) {
        return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1");
    }
    var match = document.cookie.match(
        RegExp("(?:^|;\\s*)" + escape(name) + "=([^;]*)")
    );
    return match ? match[1] : null;
};

export const setCookie = (key: string, value: string): void => {
    const rightNow = new Date().getTime();
    document.cookie = `${key}=${value}; expires=${new Date(
        rightNow * 2 * 60 * 60 * 1000
    )}; path=/; SameSite=Lax;`;
};
// #endregion
export const api = "https://localhost:5100";

// #region General Variables
export const cookieData = writable({});
export const isTransitionPlaying = writable(false);
export const currentPage = writable(Pages.Title);
export const userId = writable("");
export const username = writable("Naka");
export const userClass = writable<null | Classes>(null);
export const roomCode = writable(1);
export const errorMessage = writable("");
// #endregion

// #region Settings Variables
export const isSettingsDialogOpen = writable<boolean>(false);
export const isAnimationEnabled = writable(false);
export const isShowingChat = writable(false);
export const isChatDisplayed = writable(true);
// #endregion

// #region Helper Functions
export const transitionDuration = 3;
export const transitionToNewPage = (pageToTransitionTo: Pages) => {
    isTransitionPlaying.set(true);
    setTimeout(() => {
        currentPage.set(pageToTransitionTo);
    }, (transitionDuration * 1000) / 2);
    setTimeout(() => {
        isTransitionPlaying.set(false);
    }, transitionDuration * 1050);
};

export const showTempErrorMessage = (msg: string, time: number = 5000) => {
    errorMessage.set(msg);
    setTimeout(() => {
        errorMessage.set("");
    }, time);
};

export const isCoordEqual = (coordA: Coordinate, coordB: Coordinate) => {
    return coordA.row === coordB.row && coordA.column === coordB.column;
};
// #endregion

// #region Game State Variables
export const gameboard = writable<GameBoardTile[][]>([]);
export const yonkadingo = writable<Yonkadingo>({
    location: { row: 0, column: 3 },
    hp: 50,
    food: 10,
    pellets: 10,
    isDodging: false,
    extraMoves: 0,
    lastTilesMoved: [],
});
export const currentTurn = writable<Classes>(Classes.Steward);
// #endregion

// #region Game Class Vars
export const totalTopmanTilesAllowed = writable<number>(3);
export const topmanSelectedTiles = writable<Coordinate[]>([]);
export const topmanWarning = writable<string>("");

export const totalHelmsmanMovesAllowed = writable<number>(3);
export const helmsmanMovesPerformed = writable<Coordinate[]>([]);
export const helmsmanWarning = writable<string>("");

export const gunnerLaserDirection = writable<
    null | "up" | "right" | "down" | "left"
>(null);
export const gunnerSelectedTiles = writable<Coordinate[]>([]);
export const gunnerWarning = writable<string>("");
