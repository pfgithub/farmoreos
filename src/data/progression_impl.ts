import { ActiveMods, FeatureFlags, PrototypeData } from "factorio:common";
import { IconData } from "factorio:prototype";
import { Modifier } from "factorio:prototype";
import { AnyPrototype, ItemGroup, ItemSubGroup, RecipeCategory, TechnologyPrototype } from "factorio:prototype";
declare const data: PrototypeData;
declare const mods: ActiveMods;
declare const feature_flags: FeatureFlags;

export type ID<T extends string, Q = unknown> = {kind: T, name: string, prototype: Q};
const namespace = "farmoreos";

export type Icon = {path: string, size: number};

let next_order = 1000;
function nextOrder(): string {
    return tostring(next_order++);
}

export function id<T extends string>(kind: T, name: string): ID<NoInfer<T>, undefined> {
    return {kind, name, prototype: undefined};
}
export function mkret<T extends string, U extends AnyPrototype>(kind: NoInfer<T>, name: string, value: NoInfer<U>): ID<T, U> {
    data.extend([value]);
    return {kind, name, prototype: value};
}

export function itemGroup(name: string, icon: Icon): ID<"item-group", ItemGroup> {
    name = `${namespace}-${name}`;
    return mkret("item-group", name, {
        type: "item-group",
        name,
        order: `z${name}`,
        icons: toIcons(icon),
    });
}
export function itemSubgroup(group: ID<"item-group">, name: string): ID<"item-subgroup", ItemSubGroup> {
    name = `${namespace}-${name}`;
    return mkret("item-subgroup", name, {
        type: "item-subgroup",
        name,
        group: group.name,
        order: nextOrder(),
    });
}

export function quickRecipeCategory(name: string): ID<"recipe-category", RecipeCategory> {
    name = `${namespace}-${name}`;
    return mkret("recipe-category", name, {
        type: "recipe-category",
        name: name,
        order: nextOrder(),
    });
}

function toIcons(icon: Icon): IconData[] {
    return [{icon: icon.path, icon_size: icon.size}];
}

export function quickTechnology(name: string, opts: {
    essential: boolean,
    icon: Icon,
    cost: {items: ID<"item">[], count: number, time: number},
    prerequisites: ID<"technology">[],
    effects: ID<string>[],
}): ID<"technology", TechnologyPrototype> {
    name = `${namespace}-${name}`;
    return mkret("technology", name, {
        type: "technology",
        name: name,
        icons: toIcons(opts.icon),
        essential: opts.essential,
        unit: {
            count: opts.cost.count,
            time: opts.cost.time,
            ingredients: opts.cost.items.map(item => ([item.name, 1])),
        },
        prerequisites: opts.prerequisites.map(prereq => prereq.name),
        effects: opts.effects.map((fx): Modifier => {
            if (fx.kind === "recipe") {
                return {type: "unlock-recipe", recipe: fx.name};
            } else {
                error("todo fx type " + fx);
            }
        }),
    });
}

export function quickItem(subgroup: ID<"item-subgroup">, name: string, icon: Icon, attrs: {
    contaminable?: boolean,
    edible?: number,
    researchable?: boolean,
}): ID<"item"> {
    name = `${namespace}-${name}`;
    return id("item", name);
}

// some recipe types will be special. ie waiting sets spoil properties on the base item. cooking makes heating/cooling recipes & spoilage setups.
export function quickRecipe(subgroup: ID<"item-subgroup">, name: string, category: ID<"recipe-category">, opts: {
    sec: number,
    from: {name: ID<"item"> | ID<"fluid">, amount: number}[],
    to: {name: ID<"item"> | ID<"fluid">, amount: number, extra_count_fraction?: number}[],
}): ID<"recipe"> {
    name = `${namespace}-${name}`;
    return id("recipe", name);
}
