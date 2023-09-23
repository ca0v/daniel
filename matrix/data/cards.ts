type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Mythic"
type RangeDirection = "Adjacent" | "Diagonal" | "Straight" | "All"

class GenericCard {
  name: string

  rarity: Rarity

  health:
    | number
    | {
        Dice: {
          type: "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100"
          bonus: number
        }
      }

  movement: {
    distance: number
    direction: RangeDirection
  }

  attacks: null | Array<{
    name: string
    range: {
      direction: RangeDirection
      distance: number
    }
    damage: number
    notes: string
  }>

  passive: null | string

  abilities: string

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
    Dice: {
      type: "d6",
      bonus: 2,
    },
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
      notes: "",
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
})
