const NONE = 'none';
export {
  Attack,
  Dice,
  Damage,
  DamageBonus,
  Formula,
  GenericCard,
  Health,
  Movement,
  Upgrade, 
  RangeDirections,
  orthogonalRanges,
  diagonalRanges,
  adjacentRanges,
  forwardRanges,
  NONE
}

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

type RangeDirections = "←" | "↑" | "→" | "↓" | "↖" | "↗" | "↘" | "↙";
type RangeDirection = RangeDirections | Array<RangeDirections>;

const orthogonalRanges: RangeDirections[] = ["←", "↑", "↓", "→"];
const diagonalRanges: RangeDirections[] = ["↖", "↙", "↗", "↘"];
const adjacentRanges: RangeDirections[] = orthogonalRanges.concat(diagonalRanges);
const forwardRanges: RangeDirections[] = ["↖", "↑", "↗"];

type Movement = {
  distance: number | "Touch"
  direction: RangeDirection
}

type DamageBonus = {
  type: Dice | Array<Dice>
  bonus: number
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
  | DamageBonus

type Formula = string

type Health =
  | number
  | Formula
  | DamageBonus

type Upgrade = { with: string; become: string };

class GenericCard {
  name?: string
  rarity?: Rarity
  health?: Health
  movement?: null | Movement
  attacks?: null | Array<Attack>
  passive?: null | string
  ability?: null | string | Attack
  uses?: number
  upgrades?: Array<Upgrade>

  constructor(state: Partial<GenericCard>) {
    Object.assign(this, state)
  }
}


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

export function print(target: HTMLElement, cards: GenericCard[]) {
  const printer = new CardPrinter(target);
  cards.forEach(c => printer.print(c));
}


function asDom(html: string) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.firstElementChild as HTMLElement;
}