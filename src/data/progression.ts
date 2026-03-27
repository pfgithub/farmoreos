import { day_to_seconds } from "../constants";
import { id, itemGroup, itemSubgroup, quickItem, quickRecipe, quickRecipeCategory, quickTechnology } from "./progression_impl";

const categories = {};

const recipe_category = {
    crafting: id("recipe-category", "crafting"),
    growing: quickRecipeCategory("growing"),
    blending: quickRecipeCategory("blending"),
};
const item = {
    wood: id("item", "wood"),
    iron_plate: id("item", "iron-plate"),
    ice: id("item", "ice"),
    kale_seeds: quickItem("kale-seeds", "__farmoreos__/art/kale-seeds.png", {}),
    kale_leaf: quickItem("kale-leaf", "__farmoreos__/art/kale-leaf2.png", {contaminable: true, edible: 5}),
    kale_smoothie: quickItem("kale-smoothie", "__farmoreos__/art/kale-smoothie.png", {contaminable: true, researchable: true}),
    watering_can_empty: quickItem("watering-can-empty", "__farmoreos__/art/watering-can-empty.png", {}),
    watering_can_full: quickItem("watering-can", "__farmoreos__/art/watering-can.png", {}),
    hoe: quickItem("hoe", "__farmoreos__/art/hoe.png", {}),
};

const recipes = itemGroup("main", {
    tools: itemSubgroup("tools", {
        hoe_recipe: quickRecipe("hoe", recipe_category.crafting, {
            sec: 1,
            from: [{name: item.iron_plate, amount: 20}, {name: item.wood, amount: 10}],
            to: [{name: item.hoe, amount: 1}],
        }),
        watering_can_empty: quickRecipe("watering-can-empty", recipe_category.crafting, {
            sec: 1,
            from: [{name: item.iron_plate, amount: 20}],
            to: [{name: item.watering_can_empty, amount: 1}]
        }),
    }),
    seeds: itemSubgroup("seeds", {
        kale_seeds: quickRecipe("kale-seeds", recipe_category.crafting, {
            sec: 1,
            from: [{name: item.wood, amount: 30}],
            to: [{name: item.kale_seeds, amount: 1}]
        }),
    }),
    vegetables: itemSubgroup("vegetables", {
        kale_leaf: quickRecipe("kale-leaf", recipe_category.growing, {
            sec: 2 * day_to_seconds,
            from: [{name: item.kale_seeds, amount: 1}],
            to: [
                {name: item.kale_leaf, amount: 10},
                {name: item.kale_seeds, amount: 1, extra_count_fraction: 0.1},
            ],
        }),
    }),
    research: itemSubgroup("research", {
        kale_smoothie: quickRecipe("kale-smoothie", recipe_category.blending, {
            sec: 1,
            from: [
                {name: item.kale_leaf, amount: 10},
                {name: item.ice, amount: 10},
            ],
            to: [{name: item.kale_smoothie, amount: 1}],
        }),
    }),
})

quickTechnology("basic-farming", {
    unlocks: [
        recipes.tools.watering_can_empty,
        recipes.seeds.kale_seeds,
        recipes.vegetables.kale_leaf,
        recipes.research.kale_smoothie,
    ],
});