import { PrototypeData, ActiveMods, FeatureFlags } from "factorio:common"
import { ArmorPrototype, RecipePrototype, ShortcutPrototype, ToolPrototype, ItemGroup, ItemSubGroup, CapsulePrototype, ItemPrototype, TilePrototype, CollisionLayerPrototype } from "factorio:prototype";
import * as util from "util";
declare const data: PrototypeData;
declare const mods: ActiveMods;
declare const feature_flags: FeatureFlags;

const fireArmor: ArmorPrototype = util.copy(data.raw.armor["heavy-armor"]!);
fireArmor.name = "fire-armor";
fireArmor.icons = [
    {
        icon: fireArmor.icon!,
        icon_size: fireArmor.icon_size,
        tint: {r: 1, g: 0, b: 0, a: 0.3},
    },
];


fireArmor.resistances = [
    {
        type: "physical",
        decrease: 6,
        percent: 10,
    },
    {
        type: "explosion",
        decrease: 10,
        percent: 30,
    },
    {
        type: "acid",
        decrease: 5,
        percent: 30,
    },
    {
        type: "fire",
        decrease: 0,
        percent: 100,
    },
];

data.extend([fireArmor]);
data.extend([{
    type: "recipe",
    name: "fire-armor",
    enabled: true,
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "copper-plate", amount: 200},
        {type: "item", name: "steel-plate", amount: 50}
    ],
    results: [{type: "item", name: "fire-armor", amount: 1}],
} satisfies RecipePrototype]);
data.extend([{
    type: "shortcut",
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
    type: "capsule",
    stack_size: 1,
    name: "farmoreos-watering-can-empty",
    icon: "__farmoreos__/art/watering-can-empty.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
    capsule_action: {
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
        },
    },
    order: "b",
} satisfies CapsulePrototype]);

data.extend([{
    type: "tool",
    stack_size: 1,
    name: "farmoreos-watering-can",
    durability: 50,
    durability_description_key: "description.farmoreos-watering-can-remaining-amount-key",
    durability_description_value: "description.farmoreos-watering-can-remaining-amount-value",
    icon: "__farmoreos__/art/watering-can.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
    order: "c",
    place_as_tile: {
        result: "farmoreos-farmland-wet",
        condition_size: 1,
        condition: {
            layers: {farmoreos_farmland_dry: true},
        },
        invert: true,
    },
} satisfies ToolPrototype]);

data.extend([{
    type: "item",
    stack_size: 1,
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
    name: "farmoreos-watering-can-recipe",
    enabled: true,
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "iron-plate", amount: 10},
    ],
    results: [{type: "item", name: "farmoreos-watering-can-empty", amount: 1}],
} satisfies RecipePrototype]);

data.extend([{
    type: "recipe",
    name: "farmoreos-hoe-recipe",
    enabled: true,
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "iron-plate", amount: 10},
        {type: "item", name: "wood", amount: 3},
    ],
    results: [{type: "item", name: "farmoreos-hoe", amount: 1}],
} satisfies RecipePrototype]);

data.extend([{
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
} satisfies CollisionLayerPrototype])
data.extend([{
    type: "collision-layer",
    name: "farmoreos_farmland_dry",
} satisfies CollisionLayerPrototype])


declare module "factorio:common" {
  export interface CustomInputNames {}
}

export {};