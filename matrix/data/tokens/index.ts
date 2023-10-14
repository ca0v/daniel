const NONE = "none";

import { farmPack } from "../cards/farmpack.js";
import { DamageBonus, Health } from "../cards/pack_base.js";

const farmerCard = farmPack.find(c => c.name === "Farmer")!;

const farmerToken = {
    name: farmerCard.name,
    health: farmerCard.health,
    movement: farmerCard.movement,
}

type Token = typeof farmerToken;


export function run() {
    const printer = new TokenPrinter(document.querySelector("body")!);
    printer.print(farmerToken);
}

class TokenPrinter {
    constructor(private target: HTMLElement) { }

    print(token: Token) {
        const name = token.name;
        const health = this.printHealth(token.health);
        const movement = token.movement;

        const template = `
        <div class="token">
        <span>Token:</span><span>${name}<span>
        <span>Health:</span><span>${health}<span>
        <span>Movement:</span><span>${movement}<span>
        </div>
        `

        this.target.innerHTML = template;
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
      
      printDamageBonus(dice?: DamageBonus) {
        if (!dice) return "none";
        if (!dice.bonus) return dice.type;
        return `${dice.type}+${dice.bonus}`;
      }
          
    
}

