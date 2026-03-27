import { ActiveMods, FeatureFlags, PrototypeData } from "factorio:common";
import { AnyPrototype, ItemGroup, ItemSubGroup, RecipeCategory, TechnologyPrototype } from "factorio:prototype";
declare const data: PrototypeData;
declare const mods: ActiveMods;
declare const feature_flags: FeatureFlags;

export type ID<T extends string, Q = unknown> = {kind: T, name: string, prototype: Q};
const namespace = "farmoreos";

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

export function itemGroup(name: string, icon: string, icon_size: number): ID<"item-group", ItemGroup> {
    name = `${namespace}-${name}`;
    return mkret("item-group", name, {
        type: "item-group",
        name,
        order: `z${name}`,
        icon,
        icon_size,
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


export function quickTechnology(name: string, opts: {
    essential: boolean,
    icon: {path: string, size: number},
    cost: {items: ID<"item">[], count: number, time: number},
    unlocks: ID<string>[],
}): ID<"technology", TechnologyPrototype> {
    name = `${namespace}-${name}`;
    return mkret("technology", name, {
        type: "technology",
        name: name,
        icon: opts.icon.path,
        icon_size: opts.icon.size,
        essential: opts.essential,
        unit: {
            count: opts.cost.count,
            time: opts.cost.time,
            ingredients: opts.cost.items.map(item => ([item.name, 1])),
        },
    });
}

export function quickItem(subgroup: ID<"item-subgroup">, name: string, picture: string, attrs: {
    contaminable?: boolean,
    edible?: number,
    researchable?: boolean,
}): ID<"item"> {
    name = `${namespace}-${name}`;
    return id("item", name);
}

export function quickRecipe(subgroup: ID<"item-subgroup">, name: string, category: ID<"recipe-category">, opts: {
    sec: number,
    from: {name: ID<"item"> | ID<"fluid">, amount: number}[],
    to: {name: ID<"item"> | ID<"fluid">, amount: number, extra_count_fraction?: number}[],
}): ID<"recipe"> {
    name = `${namespace}-${name}`;
    return id("recipe", name);
}
