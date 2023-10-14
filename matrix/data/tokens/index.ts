const NONE = "none";

import { farmPack } from "../cards/farmpack.js";
import type { DamageBonus, Health, Movement, RangeDirections } from "../cards/pack_base.js";

const farmTokens = farmPack.map(c => ({
    name: c.name,
    health: c.health,
    movement: c.movement,
}));

farmPack.forEach(p => {
    p.attacks?.forEach(attack => {
        const damage = attack.damage;
        if (!damage) return;
        if (typeof damage === "number") return;
        if (damage.type !== "summon") return;
        const health = damage.health;
        const movement = damage.movement;
        farmTokens.push({
            name: attack.name,
            health,
            movement,
        });
    });
});

type Token =  {
    name: string | undefined;
    health: Health | undefined;
    movement: Movement | null | undefined;
}


export function run() {
    const printer = new TokenPrinter(document.querySelector("body")!);
    printer.print([...farmTokens,...farmTokens, ...farmTokens,...farmTokens, ...farmTokens,...farmTokens, ...farmTokens,...farmTokens, ...farmTokens,...farmTokens]);
}

class TokenPrinter {
    constructor(private target: HTMLElement) { }

    print(tokens: Token[]) {
        const template = tokens.map(t => this.printToken(t)).join("");
        this.target.innerHTML = `<div class="tokens">${template}</div>`;
    }

    printToken(token: Token) {
        const name = token.name;
        const health = this.printHealth(token.health);
        const movement = this.printMovement(token.movement!);

        return `
        <div class="token">
        <span class="label value center larger underline">${name}</span>
        <span class="label">Health:</span><span class="value">${health}</span>
        <span class="label">Movement:</span><span class="value">${movement}</span>
        </div>
        `
    }

    printMovement(movement?: Movement) {
        if (!movement) return NONE;
        const direction = this.printDirection(movement.direction);
        return `<div class="directions">${direction}</div>:${movement.distance}`
      }

      printDirection(direction: string | RangeDirections[]): string {
        if (!direction) return NONE;
        if (typeof direction === "string") return `<div class="direction ${direction}">${direction}</div>`;
        return direction.map(d => this.printDirection(d)).join("");
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

