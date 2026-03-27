import { ActiveMods, FeatureFlags, PrototypeData } from "factorio:common";
import { RecipeCategory, TechnologyPrototype } from "factorio:prototype";
declare const data: PrototypeData;
declare const mods: ActiveMods;
declare const feature_flags: FeatureFlags;

export type ID<T extends string> = {kind: T, name: string};
const namespace = "farmoreos";

let next_order = 1000;
function nextOrder(): string {
    return tostring(next_order++);
}

export function id<T extends string>(kind: T, name: string): ID<NoInfer<T>> {
    return {kind, name};
}

export function itemGroup<T extends {[key: string]: {[key: string]: ID<string>}}>(name: string, ch: T): NoInfer<T> {
    name = `${namespace}-${name}`;
    return ch;
}
export function itemSubgroup<T extends {[key: string]: ID<string>}>(name: string, ch: T): NoInfer<T> {
    name = `${namespace}-${name}`;
    return ch;
}

export function quickTechnology(name: string, opts: {
    unlocks: ID<string>[],
}): ID<"technology"> {
    name = `${namespace}-${name}`;
    data.extend([{
        type: "technology",
        name: name,
    } satisfies TechnologyPrototype]);
    return id("technology", name);
}

export function quickItem(name: string, picture: string, attrs: {
    contaminable?: boolean,
    edible?: number,
    researchable?: boolean,
}): ID<"item"> {
    name = `${namespace}-${name}`;
    return id("item", name);
}

export function quickRecipe(name: string, category: ID<"recipe-category">, opts: {
    sec: number,
    from: {name: ID<"item"> | string, amount: number}[],
    to: {name: ID<"item"> | string, amount: number, extra_count_fraction?: number}[],
}): ID<"recipe"> {
    name = `${namespace}-${name}`;
    return id("recipe", name);
}

export function quickRecipeCategory(name: string): ID<"recipe-category"> {
    name = `${namespace}-${name}`;
    data.extend([{
        type: "recipe-category",
        name: name,
        order: nextOrder(),
    } satisfies RecipeCategory]);
    return id("recipe-category", name);
}
