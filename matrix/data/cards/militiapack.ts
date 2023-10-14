
import { GenericCard, Health, Movement, DamageBonus, Damage, Attack, Upgrade, RangeDirections, orthogonalRanges, adjacentRanges, diagonalRanges, forwardRanges, NONE } from "./pack_base.js";

const RiflemanCard = new GenericCard({
    name: "Rifleman",
    rarity: "Common",
    health: {
        type: "d6",
        bonus: 0,
    },
    movement: {
        distance: 1,
        direction: adjacentRanges,
    },
    attacks: [
        {
            name: "Rifle",
            range: {
                distance: 3,
                direction: adjacentRanges,
            },
            damage: 1,
        },
    ],
    passive: "If this token is discarded you may place the Rifleman card into your hand. If you already are at Max Card Limit you may not use this passive",

    ability: NONE,
    uses: 0,
    upgrades: [{ with: "2 Actions", become: "Sniper" }],
})

const GrenadierCard = new GenericCard({
    name: "Grenadier",
    rarity: "Uncommon",
    health: {
        type: "d8",
        bonus: 2,
    },
    movement: {
        distance: 1,
        direction: orthogonalRanges,
    },
    attacks: [
        {
            name: "Grenade",
            range: {
                distance: 2,
                direction: orthogonalRanges
            },
            damage: {
                type: ["d4", "d4"],
                bonus: 0,
            },
            notes: "On next turn, The target and adjacent spaces recieve amount of damage specified"
        }
    ],
    passive: NONE,
    ability: NONE,
    uses: 0,
    upgrades: []
});

export const militiaPack = [
    RiflemanCard, GrenadierCard
];

