import { id, quickItem, quickRecipe, quickRecipeCategory, quickTechnology } from "./progression_impl";

const categories = {};

const recipe_category = {
    crafting: id("recipe-category", "crafting"),
    blending: quickRecipeCategory("blending"),
};
const item = {
    wood: id("item", "wood"),
    iron_plate: id("item", "iron-plate"),
    kale_seeds: quickItem("kale-seeds", "__farmoreos__/art/kale-seeds.png"),
    kale_leaf: quickItem("kale-leaf", "__farmoreos__/art/kale-leaf2.png"),
    kale_smoothie: quickItem("kale-smoothie", "__farmoreos__/art/kale-smoothie.png"),
    watering_can_empty: quickItem("watering-can-empty", "__farmoreos__/art/watering-can-empty.png"),
    watering_can_full: quickItem("watering-can", "__farmoreos__/art/watering-can.png"),
};

quickTechnology("basic-farming", {
    unlocks: [
        quickRecipe("kale-seeds", recipe_category.crafting, [{name: item.wood, count: 20}], [{name: item.kale_seeds, count: 1}]),
        quickRecipe("watering-can-empty", recipe_category.crafting, [{name: item.iron_plate, count: 20}], [{name: item.watering_can_empty, count: 1}]),
        quickRecipe("kale-smoothie", recipe_category.blending, [{name: item.kale_leaf, count: 10}], [{name: item.kale_smoothie, count: 1}]),
    ],
});