import { ResourceTypes } from "../stores";

// REVEALED MESSAGE
export const notRevealed =
    "This tile has yet to be revealed by the Topman. Should it become revealed, details about what lies here will be given to the players.";

// VESSEL MESSAGES
export const tileHasYonkadingo =
    "Your vessel, the mighty Yonkadingo, resides on this tile.  You are subject to the weather effects of this tile until your Helmsman makes their move to their next tile.";
export const tileHasAI = "The scourge you wish to defeat resides on this tile!";

// RESOURCE MESSAGE
export const getResourceMessage = (
    resourceType: ResourceTypes,
    resourceCount: number
): string => {
    return resourceCount === 0
        ? "Neither food nor pellets will be gathered if the Helmsman passes through this tile."
        : `If the helmsman passes over this tile while steering, they will ${
              resourceCount > 0
                  ? `gain ${resourceCount}`
                  : `lose ${Math.abs(resourceCount)}`
          } ${ResourceTypes[resourceType]}`;
};

// MINE MESSAGES
export const tileHasMine =
    "Either your gunner has laid a mine here or the last time you checked this tile it had a mine." +
    " If your Helmsman steers you over a mine, your Yonkadingo will take damage!" +
    " Keep in mind, if the enemy ran into this mine after the tile was revealed, the tile may not have a mine anymore.";
export const tileHasNoMine =
    "The last time you checked, this tile had no mine and your Yonkadingo could travel over it without taking damage." +
    " Keep in mind, this is the state of the tile when it was last revealed by the Topman." +
    " If the enemy placed a mine after the Topman revealed this tile, it may now contain a mine.";

// WEATHER MESSAGES
export const weatherDescriptions = [
    "",
    "",
    "💨 Tailwind: A strong tailwind propels your Yonkadingo forward. A Helmsman that passes through this tile will gain an extra move on their turn.",
    "🐌 Headwind: A strong headwind buffets your Yonkadingo.  A Helmsman that passes through this tile moves one fewer space than expected.",
    "😶‍🌫️ Tucked Away: Tall cliffs surround you, giving you places to hide from detection.  A Bosun cannot detect you and a Gunner finds you more difficult to hit if you are attacked while on this tile.",
    "🎯 Wide Open: The sea is open.  The wind is still.  The Yonkadingo's bright horns, a beacon of its location.  A Bosun that detects you reveals your exact coordinates and a Gunner more easily draws a bead on you if you are attacked while on this tile.",
    "☀️ Clear Skies: Neither cloud, nor mist, nor mirage block your view.  A Topman on this tile can spy on an additional tile on their turn.",
    "⛅ Dense Fog: Clouds roil, mist gathers, and shadows coil around your vision.  A topman on this tile can spy on one fewer tile on their turn.",
    "🌅 Calm Waters: The waves are low and lazy, the currents mild.  The predictability of the ship invigorates the Bosun, allowing them to reduce the cost of actions even further.",
    "🌊 Rough Seas: The waters churn and break your footing.  A Bosun on this tile finds it difficult to improve the efficacy of the ships machinery.",
    "⏳ Ample Time: Everyone is having no problems performing their roles, allowing the steward to assist efficiency.  A steward on this tile has a higher chance to reduce action costs.",
    "⏱ Rush Job: Everyone is scrambling to perform their duties, their unpredictability causing the steward to falter.  A steward on this tile is less likely to reduce action costs.",
    "🤤 Feeding Frenzy: A recent storm has left a bountiful spread of food on these waters.  Negative food becomes positive and positive food is doubled on this tile.",
    "🍽 Famine: You were sure that this location would have food or pellets, but when you arrived, there was nothing to be found.  Positive food effects on this tile are negated.",
    "🌕 Full Moon: The moon is bright in the sky and strands of the weave can be seen in the air. Negative pellets become positive and positive pellets are doubled on this tile.",
    "🌑 New Moon: The moon is nowhere to be found and the weave hides from mortal eyes.  Positive pellet effects are negated on this tile.",
    "🧚 Nice Sprites: Glowing figures and a merry tune drifts towards you on a salty breeze.  The Yonkadingo approaches these waters happily. Any vessel that ends its turn on this tile is repaired slightly.",
    "👿 Scary Monsters: Dark shadows loom in the depths below these waters.  The Yonkadingo shows fear if you steer it closer. Any vessel that ends its turn on this tile takes slight damage.",
];
