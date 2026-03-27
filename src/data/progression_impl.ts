import { ActiveMods, FeatureFlags, PrototypeData } from "factorio:common";
import { AssemblingMachinePrototype, TechnologyPrototype, CapsuleAction, CapsulePrototype, CollisionLayerPrototype, Color, EntityPrototypeFlags, FurnacePrototype, ItemGroup, ItemPrototype, ItemSubGroup, ItemToPlace, PlantPrototype, ProductPrototype, RecipeCategory, RecipePrototype, ShortcutPrototype, TilePrototype, ToolPrototype, TransportBeltPrototype } from "factorio:prototype";
import * as util from "util";
import { contamination_items, day_to_seconds, day_to_ticks, hour_to_ticks } from "../constants";
declare const data: PrototypeData;
declare const mods: ActiveMods;
declare const feature_flags: FeatureFlags;

const namespace = "farmoreos";

let next_order = 1000;
function nextOrder(): string {
    return tostring(next_order++);
}

export function id<T extends string>(kind: T, name: string): ID<NoInfer<T>> {
    return {kind, name};
}

export type ID<T extends string> = {kind: T, name: string};
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

export function quickItem(name: string, picture: string): ID<"item"> {
    name = `${namespace}-${name}`;
    return id("item", name);
}

export function quickRecipe(name: string, category: ID<"recipe-category">, from: {name: ID<"item"> | string, count: number}[], to: {name: ID<"item"> | string, count: number}[]): ID<"recipe"> {
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
