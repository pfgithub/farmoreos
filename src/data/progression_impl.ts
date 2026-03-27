// import { ActiveMods, FeatureFlags, PrototypeData } from "factorio:common";
// import { AssemblingMachinePrototype, TechnologyPrototype, CapsuleAction, CapsulePrototype, CollisionLayerPrototype, Color, EntityPrototypeFlags, FurnacePrototype, ItemGroup, ItemPrototype, ItemSubGroup, ItemToPlace, PlantPrototype, ProductPrototype, RecipeCategory, RecipePrototype, ShortcutPrototype, TilePrototype, ToolPrototype, TransportBeltPrototype } from "factorio:prototype";
// import * as util from "util";
// import { contamination_items, day_to_seconds, day_to_ticks, hour_to_ticks } from "../constants";
// declare const data: PrototypeData;
// declare const mods: ActiveMods;
// declare const feature_flags: FeatureFlags;

// type TechnologyUnlock = {kind: string, name: string}[];

// export type ID<T extends string> = {kind: T, name: string};
// export function quickTechnology(opts: {
//     name: string,
//     unlocks: TechnologyUnlock[],
// }): ID<"technology"> {
//     data.extend([{
//         type: "technology",
//     } satisfies TechnologyPrototype]);
//     return {kind: "technology", name: opts.name};
// }

// export function quickItem(name: string, picture: string): ID<"item"> {}

// export function quickRecipe(category: ID<"recipe-category">, from: {name: ID<"item"> | string, count: number}[], to: {name: ID<"item"> | string, count: number}[]): ID<"recipe"> {}
