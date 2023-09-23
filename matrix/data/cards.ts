type Attack = {
  name: string
  range: Movement
  damage: Damage
  notes?: string
}

type Dice = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100"
type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Mythic"
  | "Uncommon+"
type RangeDirection = "Adjacent" | "Diagonal" | "Forward" | "Touch" | "All"

type Movement = {
  distance: number
  direction: RangeDirection
}

type Damage =
  | number
  | {
      type: "summon"
      name: string
      health: Health
      movement: Movement
      attacks: Array<Attack>
    }
  | {
      type: Dice | Array<Dice>
      bonus: number
    }

type Formula = string

type Health =
  | number
  | Formula
  | {
      type: Dice | Array<Dice>
      bonus: number
    }

class GenericCard {
  name: string

  rarity: Rarity

  health: Health

  movement: null | Movement

  attacks: null | Array<Attack>

  passive: null | string

  abilities: null | string

  uses: number

  upgrades: Array<{ with: string; become: string }>

  constructor(state: Partial<GenericCard>) {
    Object.assign(this, state)
  }
}

const FarmerCard = new GenericCard({
  name: "Farmer",
  rarity: "Common",
  health: {
    type: "d6",
    bonus: 2,
  },
  movement: {
    distance: 1,
    direction: "Adjacent",
  },
  attacks: [
    {
      name: "Pitchfork",
      range: {
        distance: 1,
        direction: "Adjacent",
      },
      damage: 1,
    },
  ],
  passive: null,
  abilities:
    "Call: Summon Chicken in an Adjacent space with Health: 1d4, Movement: 3 All, Attack: Peck: 1",
  uses: 1,
  upgrades: [{ with: "Tractor", become: "Tractor Rider" }],
})

const ScarecrowCard = new GenericCard({
  name: "Scarecrow",
  rarity: "Common",
  health: 6,
  movement: {
    distance: 1,
    direction: "Adjacent",
  },
  attacks: [
    {
      name: "Crow Launch",
      range: {
        distance: 1,
        direction: "Adjacent",
      },
      damage: 1,
    },
  ],
  passive: "Enemy cards within 1 space the Scarecrow have -1 Health",
  abilities: null,
  uses: 0,
  upgrades: [],
})

const TractorCard = new GenericCard({
  name: "Tractor",
  rarity: "Common",
  health: {
    type: ["d6", "d6"],
    bonus: 3,
  },
  movement: null,
  attacks: [
    {
      name: "Ram",
      range: {
        distance: 1,
        direction: "Touch",
      },
      damage: {
        type: "d4",
        bonus: 0,
      },
    },
  ],
  passive: "Can be pushed in any direction by a Friendly Card",
  abilities: null,
  uses: 0,
  upgrades: [{ with: "Farmer", become: "Tractor Rider" }],
})

const TractorRiderCard = new GenericCard({
  name: "Tractor Rider",
  rarity: "Uncommon+",
  health: "Max Tractor Health",
  movement: {
    distance: 1,
    direction: "Adjacent",
  },
  attacks: [
    {
      name: "Pitchfork",
      range: {
        distance: 1,
        direction: "Adjacent",
      },
      damage: {
        type: "d4",
        bonus: 0,
      },
    },
    {
      name: "Ram",
      range: {
        distance: 1,
        direction: "Touch",
      },
      damage: {
        type: "d4",
        bonus: 0,
      },
    },
  ],
  passive: null,
  abilities: "Repair: Heal up to 3 Health",
  uses: 2,
  upgrades: [],
})

const JackOLanternCard = new GenericCard({
  name: "Jack-O-Lantern",
  rarity: "Common",
  health: {
    type: "d6",
    bonus: 0,
  },
  movement: null,
  attacks: [
    {
      name: "Fire Stream",
      range: {
        distance: 3,
        direction: "All",
      },
      damage: {
        type: "d8",
        bonus: 0,
      },
    },
  ],
  passive: null,
  abilities: null,
  uses: 0,
})

const SiloCard = new GenericCard({
  name: "Silo",
  rarity: "Uncommon",
  health: 12,
  movement: null,
  attacks: [
    {
      name: "Horse",
      range: {
        distance: 1,
        direction: "All",
      },
      damage: {
        type: "summon",
        name: "Horse",
        health: {
          type: ["d4", "d4"],
          bonus: 0,
        },
        movement: {
          distance: 2,
          direction: "All",
        },
        attacks: [
          {
            name: "Kick",
            range: {
              distance: 1,
              direction: "All",
            },
            damage: {
              type: "d4",
              bonus: 0,
            },
          },
        ],
      },
    },
  ],
})
