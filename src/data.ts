import { PrototypeData, ActiveMods, FeatureFlags } from "factorio:common"
import { ArmorPrototype, RecipePrototype, ShortcutPrototype, ToolPrototype, ItemGroup, ItemSubGroup } from "factorio:prototype";
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
    type: "tool",
    stack_size: 1,
    name: "farmoreos-watering-can",
    durability: 50,
    durability_description_key: "description.farmoreos-watering-can-remaining-amount-key",
    durability_description_value: "description.farmoreos-watering-can-remaining-amount-value",
    icon: "__farmoreos__/art/watering-can.png",
    icon_size: 32,
    subgroup: "farmoreos-tools",
} satisfies ToolPrototype]);

data.extend([{
    type: "recipe",
    name: "farmoreos-watering-can-recipe",
    enabled: true,
    energy_required: 8, // time to craft in seconds (at crafting speed 1)
    ingredients: [
        {type: "item", name: "iron-plate", amount: 10},
    ],
    results: [{type: "item", name: "farmoreos-watering-can", amount: 1}],
} satisfies RecipePrototype]);


declare module "factorio:common" {
  export interface CustomInputNames {}
}

export {};