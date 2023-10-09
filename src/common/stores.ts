// This is more than a store really, it's where a lot of the general logic, variables, and constants of the app will live.
import { writable, readable } from 'svelte/store';
import { io } from "socket.io-client";

// Constants
export enum Pages {
    Title = 1,
    Class
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

export const classDescriptions: any = {
    helmsman: "The HELMSMAN steers the Yonkadingo through the harsh waters, evading traps and navigating towards rewards.",
    bosun: "The BOSUN has a simple but important job: reducing energy expended or activating shields to avoid damage.",
    topman: "The TOPMAN uses the magic powered spyglass to reveal what lies on future tiles.",
    gunner: "The GUNNER attacks the enemy ship by firing a deadly beam and laying mines.",
    steward: "The STEWARD assists a player each turn, making them more likely to succeed in their efforts."
}

export const setCookie = (key: string, value: string): void => {
    const rightNow = new Date().getTime();
    document.cookie = `${key}=${value}; expires=${new Date(rightNow * 2 * 60 * 60 * 1000)}; path=/; SameSite=Lax;`;
}

// The Websocket
export const socket = io(
    "ws://localhost:5100"
    //"wss://134.209.222.229:5100/"
);

// State Variables
export const cookieData = writable({});
export const isTransitionPlaying = writable(false);
export const transitionDuration = 3;
export const currentPage = writable(Pages.Title);
export const username = writable("Naka");
export const selectedClass = writable("");
export const roomCode = writable(-1);

// Helper Functions
export const transitionToNewPage = (pageToTransitionTo: Pages) => {
    isTransitionPlaying.set(true);
    setTimeout(()=>{currentPage.set(pageToTransitionTo);}, ((transitionDuration * 1000)/2));
    setTimeout(()=>{isTransitionPlaying.set(false);}, transitionDuration * 1000);
}