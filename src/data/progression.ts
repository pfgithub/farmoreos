import { day_to_seconds } from "../constants";
import { id, itemGroup, itemSubgroup, quickItem, quickRecipe, quickRecipeCategory, quickTechnology } from "./progression_impl";

const categories = {};

const recipe_category = {
    crafting: id("recipe-category", "crafting"),
    growing: quickRecipeCategory("growing"),
    blending: quickRecipeCategory("blending"),
    filling: quickRecipeCategory("blending"),
};
const group = {
    main: itemGroup("main", "__farmoreos__/art/item-group.png", 32),
};
const subgroup = {
    tools: itemSubgroup(group.main, "tools"),
    seeds: itemSubgroup(group.main, "seeds"),
    vegetables: itemSubgroup(group.main, "vegetables"),
    research: itemSubgroup(group.main, "research"),
};
const fluid = {
    water: id("fluid", "water"),
};
const item = {
    wood: id("item", "wood"),
    iron_plate: id("item", "iron-plate"),
    ice: id("item", "ice"),
    kale_seeds: quickItem(subgroup.seeds, "kale-seeds", "__farmoreos__/art/kale-seeds.png", {}),
    kale_leaf: quickItem(subgroup.vegetables, "kale-leaf", "__farmoreos__/art/kale-leaf2.png", {contaminable: true, edible: 5}),
    kale_smoothie: quickItem(subgroup.research, "kale-smoothie", "__farmoreos__/art/kale-smoothie.png", {contaminable: true, researchable: true}),
    watering_can_empty: quickItem(subgroup.tools, "watering-can-empty", "__farmoreos__/art/watering-can-empty.png", {}),
    watering_can_full: quickItem(subgroup.tools, "watering-can", "__farmoreos__/art/watering-can.png", {}),
    hoe: quickItem(subgroup.tools, "hoe", "__farmoreos__/art/hoe.png", {}),
};
const recipes = {
    hoe: quickRecipe(subgroup.tools, "hoe", recipe_category.crafting, {
        sec: 1,
        from: [{name: item.iron_plate, amount: 20}, {name: item.wood, amount: 10}],
        to: [{name: item.hoe, amount: 1}],
    }),
    watering_can_empty: quickRecipe(subgroup.tools, "watering-can-empty", recipe_category.crafting, {
        sec: 1,
        from: [{name: item.iron_plate, amount: 20}],
        to: [{name: item.watering_can_empty, amount: 1}]
    }),
    watering_can_full: quickRecipe(subgroup.tools, "watering-can-full", recipe_category.crafting, {
        sec: 1,
        from: [{name: item.watering_can_empty, amount: 1}, {name: fluid.water, amount: 1}],
        to: [{name: item.watering_can_empty, amount: 1}]
    }),
    kale_seeds: quickRecipe(subgroup.seeds, "kale-seeds", recipe_category.crafting, {
        sec: 1,
        from: [{name: item.wood, amount: 30}],
        to: [{name: item.kale_seeds, amount: 1}],
    }),
    kale_leaf: quickRecipe(subgroup.vegetables, "kale-leaf", recipe_category.growing, {
        sec: 2 * day_to_seconds,
        from: [{name: item.kale_seeds, amount: 1}],
        to: [
            {name: item.kale_leaf, amount: 10},
            {name: item.kale_seeds, amount: 1, extra_count_fraction: 0.1},
        ],
    }),
    kale_smoothie: quickRecipe(subgroup.research, "kale-smoothie", recipe_category.blending, {
        sec: 1,
        from: [
            {name: item.kale_leaf, amount: 10},
            {name: item.ice, amount: 10},
        ],
        to: [{name: item.kale_smoothie, amount: 1}],
    }),
};

quickTechnology("basic-farming", {
    essential: true,
    icon: {path: "__farmoreos__/art/kale-leaf.png", size: 64},
    cost: {
        // TODO: this one should depend on mining 40 wood?
        items: [id("item", "automation-science-pack")],
        count: 1,
        time: 1,
    },
    unlocks: [
        recipes.watering_can_empty,
        recipes.watering_can_full,
        recipes.hoe,
        recipes.kale_seeds,
        recipes.kale_leaf,
        recipes.kale_smoothie,
        // recipes.blender_base
        // recipes.hand_blender
        // recipes.ice
    ],
});
// quickTechnology("food-safety", {
//     essential: false,
//     icon: {path: "__farmoreos__/art/food-belt.png", size: 32},
//     cost: {
//         items: [item.kale_smoothie],
//         count: 10,
//         time: 10,
//     },
//     unlocks: [
//         recipes.food_inserter,
//         recipes.food_belt,
//     ],
// });