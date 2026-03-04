import { PrototypeData, ActiveMods, FeatureFlags } from "factorio:common"
import { EntityPrototypeFlags } from "factorio:prototype";
import { CapsuleAction } from "factorio:prototype";
import { ArmorPrototype, RecipePrototype, ShortcutPrototype, ToolPrototype, ItemGroup, ItemSubGroup, CapsulePrototype, ItemPrototype, TilePrototype, CollisionLayerPrototype, PlantPrototype, RecipeCategory } from "factorio:prototype";
import * as util from "util";
declare const data: PrototypeData;
declare const mods: ActiveMods;
declare const feature_flags: FeatureFlags;

data.extend([{
    type: "shortcut",
    // @name shortcut-name.farmoreos-cheat=Toggle Cheat
    name: "farmoreos-cheat",
    action: "lua",
    toggleable: true,
    icon: "__farmoreos__/art/cheat.png",
    icon_size: 32,
    small_icon: "__farmoreos__/art/cheat.png",
    small_icon_size: 32,
} satisfies ShortcutPrototype]);

data.extend([{
    type: "shortcut",
    // @name shortcut-name.farmoreos-reload-mods=Reload Mods
    name: "farmoreos-reload-mods",
    action: "lua",
    toggleable: false,
    icon: "__farmoreos__/art/reload-mods.png",
    icon_size: 32,
    small_icon: "__farmoreos__/art/reload-mods.png",
    small_icon_size: 32,
} satisfies ShortcutPrototype]);

data.extend([{
    type: "item-group",
    // @name item-group-name.farmoreos-group=Farmoreos
    name: "farmoreos-group",
    icon: "__farmoreos__/art/item-group.png",
    icon_size: 32,
    order: "zfarmoreos",
} satisfies ItemGroup]);

data.extend([{
    type: "item-subgroup",
    name: "farmoreos-tools",
    group: "farmoreos-group",
    order: "a",
} satisfies ItemSubGroup]);

data.extend([{
    type: "item-subgroup",
    name: "farmoreos-seeds",
    group: "farmoreos-group",
    order: "b",
} satisfies ItemSubGroup]);

data.extend([{
    type: "item-subgroup",
    name: "farmoreos-vegetables",
    group: "farmoreos-group",
    order: "c",
} satisfies ItemSubGroup]);

function noneEffect(): CapsuleAction {
    return {
        type: "use-on-self",
        uses_stack: false,
        attack_parameters: {
            type: "projectile",
            activation_type: "consume",
            ammo_category: "capsule",
            cooldown: 30,
            range: 0,
            ammo_type: {
                target_type: "position",
                action: {
                    type: "direct",
                    action_delivery: {
                        type: "instant",
                        target_effects: [
                            {
                                type: "damage",
                                damage: {type: "physical", amount: 0},
                                use_substitute: false,
                            }
                        ],
                    },
                },
            },
        }
    };
}
// fish regen -80
function regenEffect(amount: number): CapsuleAction {
    return {
        type: "use-on-self",
        attack_parameters: {
            type: "projectile",
            activation_type: "consume",
            ammo_category: "capsule",
            cooldown: 30,
            range: 0,
            ammo_type: {
                target_type: "position",
                action: {
                    type: "direct",
                    action_delivery: {
                        type: "instant",
                        target_effects: [
                            {
                                type: "damage",
                                damage: {type: "physical", amount},
                                use_substitute: false,
                            }
                        ],
                    },
                },
            },
        }
    };
}

data.extend([{
    type: "capsule",
    stack_size: 1,
    // @name item-name.farmoreos-watering-can-empty=Watering Can (Empty)
    name: "farmoreos-watering-can-empty",
    icon: "__farmoreos__/art/watering-can-empty.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
    capsule_action: noneEffect(),
    order: "b",
} satisfies CapsulePrototype]);

data.extend([{
    type: "tool",
    stack_size: 1,
    // @name item-name.farmoreos-watering-can=Watering Can (Full)
    name: "farmoreos-watering-can",
    durability: 50,
    durability_description_key: "description.farmoreos-watering-can-remaining-amount-key",
    icon: "__farmoreos__/art/watering-can.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
    order: "c",
    place_as_tile: {
        result: "farmoreos-farmland-wet",
        condition_size: 1,
        condition: {
            layers: {water_tile: true},
        },
    },
} satisfies ToolPrototype]);

data.extend([{
    type: "item",
    stack_size: 1,
    // @name item-name.farmoreos-hoe=Hoe
    name: "farmoreos-hoe",
    icon: "__farmoreos__/art/hoe.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
    order: "a",
    place_as_tile: {
        result: "farmoreos-farmland-dry",
        condition_size: 1,
        condition: {
            layers: {water_tile: true},
        },
    },
} satisfies ItemPrototype]);

data.extend([{
    type: "recipe",
    name: "farmoreos-watering-can-empty",
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "iron-plate", amount: 10},
    ],
    results: [{type: "item", name: "farmoreos-watering-can-empty", amount: 1}],
} satisfies RecipePrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-watering-can",
    category: "farmoreos-can-filling",
    energy_required: 0.5, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "farmoreos-watering-can-empty", amount: 1},
        {type: "fluid", name: "water", amount: 1},
    ],
    results: [{type: "item", name: "farmoreos-watering-can", amount: 1}],
} satisfies RecipePrototype]);
data.extend([{
    type: "recipe-category",
    name: "farmoreos-can-filling",
} satisfies RecipeCategory]);

data.extend([{
    type: "recipe",
    name: "farmoreos-hoe",
    enabled: true,
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "iron-plate", amount: 10},
        {type: "item", name: "wood", amount: 3},
    ],
    results: [{type: "item", name: "farmoreos-hoe", amount: 1}],
} satisfies RecipePrototype]);

data.extend([{
    // @name tile-name.farmoreos-farmland-dry=Farmland (Dry)
    name: "farmoreos-farmland-dry",
    type: "tile",
    order: "z[other]-a[out-of-map]",
    subgroup: "special-tiles",
    collision_mask: {
        layers: {
            ground_tile: true,
            farmoreos_farmable: true,
            farmoreos_farmland_dry: true,
        },
    },
    layer_group: "ground-artificial",
    layer: 0,
    variants: {
        main: [
            {
                picture: "__farmoreos__/art/farmland-dry.png",
                count: 1,
                size: 1,
            },
        ],
        empty_transitions: true,
    },
    placeable_by: {item: "farmoreos-hoe", count: 1},
    map_color: [0, 0, 0],
    absorptions_per_second: {pollution: 0.000025},
    minable: {mining_time: 0.1},
    decorative_removal_probability: 1,
    is_foundation: true,
} satisfies TilePrototype]);
data.extend([{
    // @name tile-name.farmoreos-farmland-wet=Farmland (Wet)
    name: "farmoreos-farmland-wet",
    type: "tile",
    order: "z[other]-a[out-of-map]",
    subgroup: "special-tiles",
    collision_mask: {
        layers: {
            ground_tile: true,
            farmoreos_farmable: true,
        },
    },
    layer_group: "ground-artificial",
    layer: 0,
    variants: {
        main: [
            {
                picture: "__farmoreos__/art/farmland-wet.png",
                count: 1,
                size: 1,
            },
        ],
        empty_transitions: true,
    },
    map_color: [0, 0, 0],
    absorptions_per_second: {pollution: 0.000025},
    minable: {mining_time: 0.1},
    decorative_removal_probability: 1,
    is_foundation: true,
    placeable_by: {item: "farmoreos-watering-can", count: 1},
} satisfies TilePrototype]);

data.extend([{
    type: "collision-layer",
    name: "farmoreos_farmable",
} satisfies CollisionLayerPrototype]);
data.extend([{
    type: "collision-layer",
    name: "farmoreos_farmland_dry",
} satisfies CollisionLayerPrototype]);


const day_to_ticks = 25200;
const day_to_seconds = day_to_ticks / 60;

const plant_flags: EntityPrototypeFlags = ["placeable-neutral", "breaths-air"]; // "placeable-off-grid"?
data.extend([{
    type: "plant",
    // @name entity-name.farmoreos-wheat=Wheat
    name: "farmoreos-wheat",
    icon: "__farmoreos__/art/wheat.png",
    icon_size: 32,
    flags: plant_flags,
    collision_mask: {
        layers: {item: true, object: true, water_tile: true, elevated_rail: true, is_lower_object: true},
    },
    variations: [
        {
            trunk: {
                filename: "__farmoreos__/art/empty.png",
                flags: ["mipmap"],
                surface: "nauvis",
                size: 1,
                frame_count: 2,
            },
            leaves: {
                filename: "__farmoreos__/art/wheat.png",
                flags: ["mipmap"],
                surface: "nauvis",
                size: 32,
                frame_count: 1,
            },
            leaf_generation: {type: "create-particle", particle_name: "leaf-particle", initial_height: 1, initial_vertical_speed: 0.01, speed_from_center: 0.01},
            branch_generation: {type: "create-particle", particle_name: "leaf-particle", initial_height: 1, initial_vertical_speed: 0.01, speed_from_center: 0.01},
        }
    ],
    growth_ticks: 2 * day_to_ticks,
    minable: {
        mining_time: 0.1,
        results: [
            {type: "item", name: "farmoreos-wheat", amount: 1},
            {type: "item", name: "farmoreos-wheat-seeds", amount: 1, extra_count_fraction: 0.1}, // ideally we would always give 1 even if not fully grown
        ],
    },
    selection_box: [[-0.4, -0.4], [0.4, 0.5]],
    collision_box: [[-0.2, -0.2], [0.2, 0.2]],
    emissions_per_second: { pollution: -0.001 },
    tile_buildability_rules: [
        {
            area: [[-0.4, -0.4], [0.4, 0.4]],
            required_tiles: {
                layers: {
                    farmoreos_farmable: true,
                }
            },
        },
    ],
    colors: [[238 / 255, 195 / 255, 154 / 255]],
    // consider setting autoplace?
} satisfies PlantPrototype]);

data.extend([{
    type: "item",
    name: "farmoreos-wheat-seeds",
    icon: "__farmoreos__/art/wheat-seeds.png",
    icon_size: 32,
    // @name item-name.farmoreos-wheat-seeds=Wheat Seeds
    localised_name: ["item-name.farmoreos-wheat-seeds"],
    subgroup: "farmoreos-seeds",
    order: "a[wheat]",
    stack_size: 100,

    fuel_category: "chemical",
    fuel_value: "1kJ",
    fuel_acceleration_multiplier: 0.25,
    fuel_top_speed_multiplier: 0.25,

    plant_result: "farmoreos-wheat",
    place_result: "farmoreos-wheat",
} satisfies ItemPrototype]);

data.extend([{
    type: "recipe",
    name: "farmoreos-wheat-seeds",
    enabled: true,
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "wood", amount: 10},
    ],
    results: [{type: "item", name: "farmoreos-wheat-seeds", amount: 1}],
} satisfies RecipePrototype]);

data.extend([{
    type: "capsule",
    // @name item-name.farmoreos-wheat=Wheat
    name: "farmoreos-wheat",
    icon: "__farmoreos__/art/wheat.png",
    icon_size: 32,
    subgroup: "farmoreos-vegetables",
    order: "a[wheat]",

    fuel_category: "chemical",
    fuel_value: "20kJ",
    fuel_acceleration_multiplier: 0.25,
    fuel_top_speed_multiplier: 0.25,
    stack_size: 100,

    capsule_action: regenEffect(-5),
} satisfies CapsulePrototype]);

data.extend([{
    type: "recipe-category",
    name: "farmoreos-farming",
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe",
    // @name recipe-name.farmoreos-wheat=Wheat
    name: "farmoreos-wheat",
    icon: "__farmoreos__/art/wheat.png",
    icon_size: 32,
    subgroup: "farmoreos-vegetables",
    order: "a[wheat]",
    category: "farmoreos-farming",
    enabled: true,
    energy_required: day_to_seconds * 2, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "farmoreos-wheat-seeds", amount: 1},
    ],
    results: [
        {type: "item", name: "farmoreos-wheat", amount: 1},
        {type: "item", name: "farmoreos-wheat-seeds", amount: 1},
        {type: "item", name: "farmoreos-wheat-seeds", amount: 1, probability: 0.1},
    ],
} satisfies RecipePrototype]);


// we could do ethanol & such

declare module "factorio:common" {
  export interface CustomInputNames {}
}

export {};