import { PrototypeData, ActiveMods, FeatureFlags } from "factorio:common"
import { EntityPrototypeFlags } from "factorio:prototype";
import { CapsuleAction } from "factorio:prototype";
import { ArmorPrototype, RecipePrototype, ShortcutPrototype, ItemGroup, ItemSubGroup, CapsulePrototype, ItemPrototype, TilePrototype, CollisionLayerPrototype, PlantPrototype, RecipeCategory, AssemblingMachinePrototype, FurnacePrototype } from "factorio:prototype";
import * as util from "util";
import { day_to_seconds, day_to_ticks, hour_to_ticks } from "./constants";
declare const data: PrototypeData;
declare const mods: ActiveMods;
declare const feature_flags: FeatureFlags;

let next_order = 1000;
function nextOrder(): string {
    return tostring(next_order++);
}

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
    order: nextOrder(),
} satisfies ItemSubGroup]);

data.extend([{
    type: "item-subgroup",
    name: "farmoreos-seeds",
    group: "farmoreos-group",
    order: nextOrder(),
} satisfies ItemSubGroup]);

data.extend([{
    type: "item-subgroup",
    name: "farmoreos-vegetables",
    group: "farmoreos-group",
    order: nextOrder(),
} satisfies ItemSubGroup]);

data.extend([{
    type: "item-subgroup",
    name: "farmoreos-plants",
    group: "farmoreos-group",
    order: nextOrder(),
} satisfies ItemSubGroup]);

data.extend([{
    type: "item-subgroup",
    name: "farmoreos-machines",
    group: "farmoreos-group",
    order: nextOrder(),
} satisfies ItemSubGroup]);

data.extend([{
    type: "item-subgroup",
    name: "farmoreos-products",
    group: "farmoreos-group",
    order: nextOrder(),
} satisfies ItemSubGroup]);
data.extend([{
    type: "item-subgroup",
    name: "farmoreos-heating",
    group: "farmoreos-group",
    order: nextOrder(),
} satisfies ItemSubGroup]);
data.extend([{
    type: "item-subgroup",
    name: "farmoreos-cooling",
    group: "farmoreos-group",
    order: nextOrder(),
} satisfies ItemSubGroup]);

function noneEffect(cooldown: number): CapsuleAction {
    return {
        type: "use-on-self",
        uses_stack: false,
        attack_parameters: {
            type: "projectile",
            activation_type: "consume",
            ammo_category: "capsule",
            cooldown,
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
function damageEffect(amount: number, cooldown: number): CapsuleAction {
    return {
        type: "use-on-self",
        attack_parameters: {
            type: "projectile",
            activation_type: "consume",
            ammo_category: "capsule",
            cooldown,
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
    // @name item-name.farmoreos-hoe=Hoe
    name: "farmoreos-hoe",
    icon: "__farmoreos__/art/hoe.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
    order: nextOrder(),
    capsule_action: noneEffect(0),
} satisfies CapsulePrototype]);
data.extend([{
    type: "capsule",
    stack_size: 1,
    // @name item-name.farmoreos-watering-can-empty=Watering Can (Empty)
    name: "farmoreos-watering-can-empty",
    icon: "__farmoreos__/art/watering-can-empty.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
    capsule_action: noneEffect(0),
    order: nextOrder(),
} satisfies CapsulePrototype]);

data.extend([{
    type: "capsule",
    stack_size: 1,
    // @name item-name.farmoreos-watering-can=Watering Can (Full)
    name: "farmoreos-watering-can",
    // durability: 50,
    // durability_description_key: "description.farmoreos-watering-can-remaining-amount-key",
    icon: "__farmoreos__/art/watering-can.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
    capsule_action: noneEffect(0),
    order: nextOrder(),
} satisfies CapsulePrototype]);


data.extend([{
    type: "recipe",
    name: "farmoreos-watering-can-empty",
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "iron-plate", amount: 10},
    ],
    results: [{type: "item", name: "farmoreos-watering-can-empty", amount: 1}],
    order: nextOrder(),
} satisfies RecipePrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-watering-can",
    category: "farmoreos-filling",
    energy_required: 0.5, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "farmoreos-watering-can-empty", amount: 1},
        {type: "fluid", name: "water", amount: 1},
    ],
    results: [{type: "item", name: "farmoreos-watering-can", amount: 1}],
    order: nextOrder(),
} satisfies RecipePrototype]);

data.extend([{
    type: "recipe",
    name: "farmoreos-hoe",
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "iron-plate", amount: 10},
        {type: "item", name: "wood", amount: 3},
    ],
    results: [{type: "item", name: "farmoreos-hoe", amount: 1}],
    order: nextOrder(),
} satisfies RecipePrototype]);

data.extend([{
    // @name tile-name.farmoreos-farmland-dry=Farmland (Dry)
    name: "farmoreos-farmland-dry",
    type: "tile",
    order: nextOrder(),
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
} satisfies TilePrototype]);
data.extend([{
    // @name tile-name.farmoreos-farmland-wet=Farmland (Wet)
    name: "farmoreos-farmland-wet",
    type: "tile",
    order: nextOrder(),
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

const plant_flags: EntityPrototypeFlags = ["placeable-neutral", "breaths-air"]; // "placeable-off-grid"?

function addPlant(plant_data: PlantPrototype) {
    const unwatered_growing = util.copy(plant_data);
    const watered_growing = util.copy(plant_data);
    unwatered_growing.name += "-unwatered";

    unwatered_growing.growth_ticks *= 32;
    data.extend([unwatered_growing, watered_growing]);
}

addPlant({
    type: "plant",
    // @name entity-name.farmoreos-wheat-unwatered=Wheat (Unwatered)
    // @name entity-name.farmoreos-wheat=Wheat
    name: "farmoreos-wheat",
    icon: "__farmoreos__/art/wheat.png",
    icon_size: 32,
    flags: plant_flags,
    collision_mask: {
        layers: {item: true, object: true, water_tile: true, elevated_rail: true, is_lower_object: true},
    },
    subgroup: "farmoreos-plants",
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
            leaf_generation: {type: "create-particle", particle_name: "leaf-particle", initial_height: 0.5, initial_vertical_speed: 0.01, speed_from_center: 0.01},
            branch_generation: {type: "create-particle", particle_name: "leaf-particle", initial_height: 0.5, initial_vertical_speed: 0.01, speed_from_center: 0.01},
        }
    ],
    growth_ticks: 2 * day_to_ticks,
    minable: {
        mining_time: 0.01,
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
    placeable_by: {item: "farmoreos-wheat-seeds", count: 1},
    // consider setting autoplace?
});

data.extend([{
    type: "item",
    name: "farmoreos-wheat-seeds",
    icon: "__farmoreos__/art/wheat-seeds.png",
    icon_size: 32,
    // @name item-name.farmoreos-wheat-seeds=Wheat Seeds
    localised_name: ["item-name.farmoreos-wheat-seeds"],
    subgroup: "farmoreos-seeds",
    order: nextOrder(),
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
    order: nextOrder(),

    fuel_category: "chemical",
    fuel_value: "20kJ",
    fuel_acceleration_multiplier: 0.25,
    fuel_top_speed_multiplier: 0.25,
    stack_size: 100,

    capsule_action: damageEffect(-5, 30),
} satisfies CapsulePrototype]);

data.extend([{
    type: "recipe-category",
    name: "farmoreos-filling",
    order: nextOrder(),
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe-category",
    name: "farmoreos-farming",
    order: nextOrder(),
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe-category",
    name: "farmoreos-milling",
    order: nextOrder(),
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe-category",
    name: "farmoreos-mixing",
    order: nextOrder(),
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe-category",
    name: "farmoreos-rising",
    order: nextOrder(),
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe-category",
    name: "farmoreos-heating",
    order: nextOrder(),
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe-category",
    name: "farmoreos-cooling",
    order: nextOrder(),
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe-category",
    name: "farmoreos-slicing",
    order: nextOrder(),
} satisfies RecipeCategory]);
data.extend([{
    type: "recipe",
    // @name recipe-name.farmoreos-wheat=Wheat
    name: "farmoreos-wheat",
    icon: "__farmoreos__/art/wheat.png",
    icon_size: 32,
    subgroup: "farmoreos-vegetables",
    order: nextOrder(),
    category: "farmoreos-farming",
    enabled: true,
    energy_required: day_to_seconds * 2, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "farmoreos-wheat-seeds", amount: 1},
    ],
    results: [
        {type: "item", name: "farmoreos-wheat", amount: 1},
        {type: "item", name: "farmoreos-wheat-seeds", amount: 1, extra_count_fraction: 0.1},
    ],
} satisfies RecipePrototype]);

data.extend([{
    type: "item",
    name: "farmoreos-wind-gristmill",
    icon: "__farmoreos__/art/wind-gristmill.png",
    icon_size: 64,
    subgroup: "farmoreos-machines",
    order: nextOrder(),
    place_result: "farmoreos-wind-gristmill",
    stack_size: 50,
} satisfies ItemPrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-wind-gristmill",
    icon: "__farmoreos__/art/wind-gristmill.png",
    icon_size: 64,
    subgroup: "farmoreos-machines",
    order: nextOrder(),
    energy_required: 1,
    ingredients: [
        {type: "item", name: "wood", amount: 15},
        {type: "item", name: "iron-plate", amount: 2},
    ],
    results: [
        {type: "item", name: "farmoreos-wind-gristmill", amount: 1},
    ],
} satisfies RecipePrototype]);
data.extend([{
    type: "furnace",
    // @name entity-name.farmoreos-wind-gristmill=Wind Gristmill
    name: "farmoreos-wind-gristmill",
    icon: "__farmoreos__/art/wind-gristmill.png",
    icon_size: 64,
    flags: ["placeable-neutral", "placeable-player", "player-creation"],
    minable: {mining_time: 0.2, result: "farmoreos-wind-gristmill"},
    max_health: 300,
    icon_draw_specification: {shift: [0, -0.3]},
    collision_box: [[-0.7, -0.7], [0.7, 0.7]],
    selection_box: [[-0.8, -1], [0.8, 1]],
    circuit_wire_max_distance: 9,
    alert_icon_shift: [0, -5],
    graphics_set: {
        animation: {
            layers: [
                {
                    filename: "__farmoreos__/art/wind-gristmill.png",
                    size: 64,
                }
            ],
        },
    },
    crafting_categories: ["farmoreos-milling"],
    crafting_speed: 1,
    energy_source: {
        type: "void",
        // it's a windmill so it's slow but uses the wind for power
    },
    energy_usage: "10kW",
    source_inventory_size: 1,
    result_inventory_size: 1,
} satisfies FurnacePrototype]);

data.extend([{
    type: "item",
    name: "farmoreos-mixer",
    icon: "__farmoreos__/art/mixer.png",
    icon_size: 96,
    subgroup: "farmoreos-machines",
    order: nextOrder(),
    place_result: "farmoreos-mixer",
    stack_size: 50,
} satisfies ItemPrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-mixer",
    icon: "__farmoreos__/art/mixer.png",
    icon_size: 96,
    subgroup: "farmoreos-machines",
    order: nextOrder(),
    energy_required: 1,
    ingredients: [
        {type: "item", name: "iron-plate", amount: 15},
        {type: "item", name: "iron-gear-wheel", amount: 4},
        {type: "item", name: "electronic-circuit", amount: 3},
    ],
    results: [
        {type: "item", name: "farmoreos-mixer", amount: 1},
    ],
} satisfies RecipePrototype]);
data.extend([{
    type: "assembling-machine",
    // @name entity-name.farmoreos-mixer=Mixer
    name: "farmoreos-mixer",
    icon: "__farmoreos__/art/mixer.png",
    icon_size: 96,
    flags: ["placeable-neutral", "placeable-player", "player-creation"],
    minable: {mining_time: 0.2, result: "farmoreos-mixer"},
    max_health: 300,
    icon_draw_specification: {shift: [0, -0.3]},
    collision_box: [[-1.2, -1.2], [1.2, 1.2]],
    selection_box: [[-1.5, -1.5], [1.5, 1.5]],
    circuit_wire_max_distance: 9,
    alert_icon_shift: [0, -5],
    graphics_set: {
        animation: {
            layers: [
                {
                    filename: "__farmoreos__/art/mixer.png",
                    size: 96,
                }
            ],
        },
    },
    crafting_categories: ["farmoreos-mixing"],
    crafting_speed: 1,
    energy_source: {
        type: "electric",
        usage_priority: "secondary-input",
        drain: "5kW",
    },
    energy_usage: "75kW",
    fluid_boxes: [
        {
            production_type: "input",
            volume: 1000,
            pipe_connections: [{ flow_direction: "input", direction: defines.direction.north, position: [0, -1] }],
        },
        {
            production_type: "input",
            volume: 1000,
            pipe_connections: [{ flow_direction: "input", direction: defines.direction.south, position: [0, 1] }],
        },
    ],
    fluid_boxes_off_when_no_fluid_recipe: true,
} satisfies AssemblingMachinePrototype]);


function addCookable(item: unknown, cook_to: string, cook_time: number) {
    const cooled = util.copy(item as ItemPrototype);
    const heated = util.copy(item as ItemPrototype);
    heated.name += "-cooking";
    heated.spoil_ticks = cook_time;
    heated.spoil_result = cook_to;
    data.extend([cooled, heated]);

    data.extend([{
        type: "recipe",
        name: cooled.name + "-heating",
        category: "farmoreos-heating",
        additional_categories: ["organic-or-hand-crafting"],
        icon: cooled.icon,
        icon_size: cooled.icon_size,
        order: nextOrder(),
        ingredients: [{type: "item", name: cooled.name, amount: 1}],
        results: [{type: "item", name: heated.name, amount: 1}],
        energy_required: 1,
        result_is_always_fresh: true,
        subgroup: "farmoreos-heating",
    } satisfies RecipePrototype]);
    data.extend([{
        type: "recipe",
        name: cooled.name + "-cooling",
        category: "farmoreos-cooling",
        additional_categories: ["organic-or-hand-crafting"],
        icon: cooled.icon,
        icon_size: cooled.icon_size,
        order: nextOrder(),
        ingredients: [{type: "item", name: heated.name, amount: 1}],
        results: [{type: "item", name: cooled.name, amount: 1}],
        energy_required: 1,
        result_is_always_fresh: true,
        subgroup: "farmoreos-cooling",
    } satisfies RecipePrototype]);
}

data.extend([{
    type: "capsule",
    // @name item-name.farmoreos-flour=Flour
    name: "farmoreos-flour",
    icon: "__farmoreos__/art/flour.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 100,
    capsule_action: damageEffect(-5, 30),
} satisfies CapsulePrototype]);
data.extend([{
    type: "capsule",
    // @name item-name.farmoreos-dough-unrisen=Dough (Unrisen)
    name: "farmoreos-dough-unrisen",
    icon: "__farmoreos__/art/dough-unrisen.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 10,
    capsule_action: damageEffect(-5, 30),
    spoil_ticks: (hour_to_ticks * 4),
    spoil_result: "farmoreos-dough-risen",
    // we should add a slow conveyor belt for rising the dough
} satisfies CapsulePrototype]);
data.extend([{
    type: "capsule",
    // @name item-name.farmoreos-dough-risen=Dough (Risen)
    name: "farmoreos-dough-risen",
    icon: "__farmoreos__/art/dough-risen.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 10,
    capsule_action: damageEffect(-5, 30),
    spoil_ticks: day_to_ticks * 3, // TODO: food preservation
    spoil_result: "spoilage",
} satisfies CapsulePrototype]);
data.extend([{
    type: "item",
    // @name item-name.farmoreos-bread-pan=Bread Pan
    name: "farmoreos-bread-pan",
    icon: "__farmoreos__/art/bread-pan.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 10,
} satisfies ItemPrototype]);
addCookable({
    type: "item",
    // @name item-name.farmoreos-dough-panned=Dough (Panned)
    // @name item-name.farmoreos-dough-panned-cooking=Dough (Panned) (Cooking)
    name: "farmoreos-dough-panned",
    icon: "__farmoreos__/art/dough-panned.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 10,
} satisfies ItemPrototype, "farmoreos-dough-cooked-cooking", hour_to_ticks / 60 * 30);
addCookable({
    type: "item",
    // @name item-name.farmoreos-dough-cooked=Bread (Panned)
    // @name item-name.farmoreos-dough-cooked-cooking=Bread (Panned) (Cooking)
    name: "farmoreos-dough-cooked",
    icon: "__farmoreos__/art/dough-cooked.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 10,
} satisfies ItemPrototype, "coal", hour_to_ticks / 60 * 10);
data.extend([{
    type: "capsule",
    // @name item-name.farmoreos-bread=Bread
    name: "farmoreos-bread",
    icon: "__farmoreos__/art/bread.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 100,
    capsule_action: damageEffect(-300, 300),
    spoil_ticks: day_to_ticks * 5,
    spoil_result: "spoilage",
} satisfies CapsulePrototype]);
addCookable({
    type: "capsule",
    // @name item-name.farmoreos-bread-slice=Bread Slice
    // @name item-name.farmoreos-bread-slice-cooking=Bread Slice (Cooking)
    name: "farmoreos-bread-slice",
    icon: "__farmoreos__/art/bread-slice.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 100,
    capsule_action: damageEffect(-50, 15),
    spoil_ticks: day_to_ticks * 3,
    spoil_result: "spoilage",
} satisfies CapsulePrototype, "farmoreos-toast-cooking", hour_to_ticks / 60 * 5);
addCookable({
    type: "capsule",
    // @name item-name.farmoreos-toast=Toast
    // @name item-name.farmoreos-toast-cooking=Toast (Cooking)
    name: "farmoreos-toast",
    icon: "__farmoreos__/art/toast.png",
    icon_size: 32,
    subgroup: "farmoreos-products",
    order: nextOrder(),
    stack_size: 100,
    capsule_action: damageEffect(-50, 15),
    spoil_ticks: day_to_ticks * 3,
    spoil_result: "spoilage",
} satisfies CapsulePrototype, "coal", hour_to_ticks / 60 * 2);

data.extend([{
    type: "recipe",
    name: "farmoreos-bread-pan",
    icon: "__farmoreos__/art/bread-pan.png",
    icon_size: 32,
    order: nextOrder(),
    subgroup: "farmoreos-products",
    ingredients: [
        {type: "item", name: "iron-plate", amount: 10},
    ],
    results: [
        {type: "item", name: "farmoreos-bread-pan", amount: 1},
    ],
    energy_required: 1,
} satisfies RecipePrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-flour",
    category: "farmoreos-milling",
    icon: "__farmoreos__/art/flour.png",
    icon_size: 32,
    order: nextOrder(),
    subgroup: "farmoreos-products",
    ingredients: [{type: "item", name: "farmoreos-wheat", amount: 1}],
    results: [{type: "item", name: "farmoreos-flour", amount: 1}],
    energy_required: 50,
} satisfies RecipePrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-dough-unrisen",
    category: "farmoreos-mixing",
    icon: "__farmoreos__/art/dough-unrisen.png",
    icon_size: 32,
    order: nextOrder(),
    subgroup: "farmoreos-products",
    ingredients: [
        {type: "item", name: "farmoreos-flour", amount: 11},
        {type: "fluid", name: "water", amount: 1},
    ],
    results: [{type: "item", name: "farmoreos-dough-unrisen", amount: 1}],
    energy_required: 10,
    result_is_always_fresh: true,
} satisfies RecipePrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-dough-panned",
    category: "farmoreos-filling",
    additional_categories: ["organic-or-hand-crafting"],
    icon: "__farmoreos__/art/dough-panned.png",
    icon_size: 32,
    order: nextOrder(),
    subgroup: "farmoreos-products",
    ingredients: [
        {type: "item", name: "farmoreos-bread-pan", amount: 1},
        {type: "item", name: "farmoreos-dough-risen", amount: 1},
    ],
    results: [{type: "item", name: "farmoreos-dough-panned", amount: 1}],
    energy_required: 1,
} satisfies RecipePrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-bread",
    category: "farmoreos-filling",
    additional_categories: ["organic-or-hand-crafting"],
    icon: "__farmoreos__/art/bread.png",
    icon_size: 32,
    order: nextOrder(),
    subgroup: "farmoreos-products",
    ingredients: [
        {type: "item", name: "farmoreos-dough-cooked", amount: 1},
    ],
    results: [
        {type: "item", name: "farmoreos-bread", amount: 1},
        {type: "item", name: "farmoreos-bread-pan", amount: 1},
    ],
    energy_required: 1,
} satisfies RecipePrototype]);
data.extend([{
    type: "recipe",
    name: "farmoreos-bread-slice",
    category: "farmoreos-slicing",
    additional_categories: ["organic-or-hand-crafting"],
    icon: "__farmoreos__/art/bread-slice.png",
    icon_size: 32,
    order: nextOrder(),
    subgroup: "farmoreos-products",
    ingredients: [
        {type: "item", name: "farmoreos-bread", amount: 1},
    ],
    results: [
        {type: "item", name: "farmoreos-bread-slice", amount: 18},
    ],
    energy_required: 1,
} satisfies RecipePrototype]);

// we could do ethanol & such

// conveyor-belts:
// Food Belt
// Slow Food Belt (for rising or cooking)

declare module "factorio:common" {
  export interface CustomInputNames {}
}

export {};