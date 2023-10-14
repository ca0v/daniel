import {GenericCard, Health, Movement, DamageBonus, Damage, Attack, Upgrade, RangeDirections, orthogonalRanges, adjacentRanges, diagonalRanges, forwardRanges, NONE} from "./pack_base.js";

const FarmerCard = new GenericCard({
  name: "Farmer",
  rarity: "Common",
  health: {
    type: "d6",
    bonus: 2,
  },
  movement: {
    distance: 1,
    direction: orthogonalRanges,
  },
  attacks: [
    {
      name: "Pitchfork",
      range: {
        distance: 1,
        direction: orthogonalRanges,
      },
      damage: {
        type: "d4",
        bonus: 0
      },
    },
  ],
  passive: null,

  ability: {
    name: "Chicken",
    range: {
      distance: 1,
      direction: adjacentRanges,
    },
    damage: {
      type: "summon",
      name: "Chicken",
      health: {
        type: "d4",
        bonus: 1,
      },
      movement: {
        distance: 2,
        direction: adjacentRanges,
      },
      attacks: [
        {
          name: "Peck",
          range: {
            distance: 1,
            direction: diagonalRanges,
          },
          damage: 2,
        },
      ],
    },
  },
  uses: 1,
  upgrades: [{ with: "Tractor", become: "Tractor Rider" }],
})

const ScarecrowCard = new GenericCard({
  name: "Scarecrow",
  rarity: "Common",
  health: 6,
  movement: {
    distance: 1,
    direction: orthogonalRanges,
  },
  attacks: [
    {
      name: "Crow Launch",
      range: {
        distance: 1,
        direction: forwardRanges,
      },
      damage: 1,
    },
  ],
  passive: "Enemy cards within 1 space the Scarecrow can not Attack or use an Ability",
  ability: null,
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
        distance: 0,
        direction: orthogonalRanges,
      },
      damage: {
        type: "d4",
        bonus: 0,
      }, 
      notes: "Pushes token back one space. If token is not able to be pushed: backed into a wall or Castle Card then it is dealt + 1 damage."
    },
  ],
  passive: "Can be pushed in any direction by a Friendly Card",
  ability: null,
  uses: 0,
  upgrades: [{ with: "Farmer", become: "Tractor Rider" }],
})

const TractorRiderCard = new GenericCard({
  name: "Tractor Rider",
  rarity: "Uncommon+",
  health: "Max Tractor Health",
  movement: {
    distance: 1,
    direction: orthogonalRanges,
  },
  attacks: [
    {
      name: "Pitchfork",
      range: {
        distance: 1,
        direction: orthogonalRanges,
      },
      damage: {
        type: "d4",
        bonus: 0,
      },
    },
    {
      name: "Ram",
      range: {
        distance: 0,
        direction: orthogonalRanges,
      },
      damage: {
        type: "d4",
        bonus: 0,
      },
      notes: "Pushes card back one space"
    },
  ],
  passive: null,
  ability: "Repair: Heal up to 3 Health",
  uses: 2,
  upgrades: [],
})

const JackOLanternCard = new GenericCard({
  name: "Jack-O-Lantern",
  rarity: "Uncommon",
  health: {
    type: "d4",
    bonus: 0,
  },
  movement: null,
  attacks: [
    {
      name: "Fire Stream",
      range: {
        distance: 3,
        direction: adjacentRanges,
      },
      damage: {
        type: "d8",
        bonus: 0,
      },
    },
  ],
  passive: null,
  ability: null,
  uses: 0,
})

const SiloCard = new GenericCard({
  name: "Silo",
  rarity: "Uncommon",
  health: 12,
  movement: null,
  attacks: [
    {
      name: "Cow",
      range: {
        distance: 1,
        direction: adjacentRanges,
      },
      damage: {
        type: "summon",
        name: "Cow",
        health: {
          type: "d8",
          bonus: 2,
        },
        movement: {
          distance: 1,
          direction: adjacentRanges,
        },
        attacks: [
          {
            name: "Stomp",
            range: {
              distance: 1,
              direction: orthogonalRanges,
            },
            damage: 2,
          },
        ],
      },
    },
    {
      name: "Horse",
      range: {
        distance: 1,
        direction: adjacentRanges,
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
          direction: adjacentRanges,
        },
        attacks: [
          {
            name: "Kick",
            range: {
              distance: 1,
              direction: adjacentRanges,
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
  passive:
    "The Silo gets discarded after 3 turns and can only be used once per turn.",
  ability: null,
  uses: 0,
  upgrades: [],
})

class CardPrinter {

  private dom: HTMLElement;

  constructor(dom: HTMLElement) {
    this.dom = dom;
  }

  private printHealth(health?: Health) {
    if (!health) return NONE;
    if (typeof health == "string") return health;
    if (typeof health == "number") return health;
    const typedHealth = health as { type: string; bonus: number };
    if (typedHealth.type) {
      return this.printDamageBonus(health)
    }
    return "todo";
  }

  printMovement(movement?: Movement) {
    if (!movement) return NONE;
    const direction = this.printDirection(movement.direction);
    return `<div class="directions">${direction}</div>:${movement.distance}`
  }

  printDamageBonus(dice?: DamageBonus) {
    if (!dice) return "none";
    if (!dice.bonus) return dice.type;
    return `${dice.type}+${dice.bonus}`;
  }

  printDamage(damage?: Damage) {
    if (!damage) return "none";
    if (typeof damage === "number") return `Damage: ${damage}`;
    switch (damage.type) {
      case "summon":
        return `${this.printSummon(damage)}`;
      default:
        return `Damage: ${this.printDamageBonus(damage)}`;
    }
  }
  printSummon(damage: Damage) {
    if (typeof damage == "number") throw "expecting summon";
    if (damage.type !== "summon") throw "expect a summon";
    const health = this.printHealth(damage.health);
    const movement = this.printMovement(damage.movement);
    const attack = this.printAttack(damage.attacks);
    return `<br/>
    Health: ${health}, 
    Movement: ${movement}, 
    Attack: ${attack}`
  }

  printAttack(attack?: Attack | Attack[]): string {
    if (!attack) return "none"
    if (Array.isArray(attack)) {
      return attack.map(a => this.printAttack(a)).join("")
    } else {
      const damage = this.printDamage(attack.damage);
      const direction = this.printDirection(attack.range.direction);
      return `
    <div class="attack">
      <span class="label">${attack.name}</span>, 
      <div class="directions">${direction}</div>: ${attack.range.distance},
      ${damage} 
      ${attack.notes ? (", " + attack.notes) : ""}
    </div>`
    }
  }

  printDirection(direction: string | RangeDirections[]): string {
    if (!direction) return NONE;
    if (typeof direction === "string") return `<div class="direction ${direction}">${direction}</div>`;
    return direction.map(d => this.printDirection(d)).join("");
  }

  printUpgrades(upgrades?: Array<Upgrade>) {
    if (!upgrades?.length) return "none";
    return upgrades?.map(upgrade => `${upgrade.with} → ${upgrade.become}`)
  }

  print(card: GenericCard) {
    const health = this.printHealth(card.health);
    const movement = this.printMovement(card.movement!)
    const attack = this.printAttack(card.attacks || []);
    const ability = this.printAbility(card.ability);
    const upgrades = this.printUpgrades(card.upgrades);

    const cardClass = card.rarity?.includes("+") ? "plus" : "standard";

    const template = `
    <div class='card'>
      <div class='card-name ${cardClass}'>${card.name}</div>
      <div class='rarity ${card.rarity}'>
        <span class="bold">Rarity</span>
        <span class="value">${card.rarity}</span>
      </div>
      <div class='health'><span class="bold">Health</span>${health}</div>
      <div class='movement'><span class="bold">Movement</span> ${movement}</div>
      <div class='attacks'><span class="bold">Attacks</span>${attack}</div>
      <div class='passive'><span class="bold">Passive</span>${card.passive || "none"}</div>
      <div class='ability'><span class="bold">Ability</span>${ability}</div>
      <div class='uses'><span class="bold">Uses</span>${card.uses}</div>
      <div class='upgrades'><span class="bold">Upgrades</span>${upgrades}</div>
    </div>`

    this.dom.append(asDom(template));
  }

  printAbility(abilities: string | Attack | null | undefined) {
    if (!abilities) return "none";
    if (typeof abilities === "string") return abilities;
    return this.printAttack(abilities);
  }


}

export const farmPack = [
  FarmerCard, ScarecrowCard, JackOLanternCard,
  SiloCard, TractorCard, TractorRiderCard
]

export function print(target: HTMLElement, cards = farmPack) {
  const printer = new CardPrinter(target);
  cards.forEach(c => printer.print(c));
}


function asDom(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.firstElementChild as HTMLElement;
}