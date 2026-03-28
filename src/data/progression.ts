import { day_to_seconds } from "../constants";
import { id, itemGroup, itemSubgroup, quickItem, quickRecipe, quickRecipeCategory, quickTechnology } from "./progression_impl";

const categories = {};

const recipe_category = {
    crafting: id("recipe-category", "crafting"),
    growing: quickRecipeCategory("growing"),
    blending: quickRecipeCategory("blending"),
    filling: quickRecipeCategory("blending"),
    waiting: quickRecipeCategory("waiting"),
    cooking: quickRecipeCategory("cooking"),
    milling: quickRecipeCategory("milling"),
    mixing: quickRecipeCategory("mixing"),
    slicing: quickRecipeCategory("slicing"),
};
const group = {
    main: itemGroup("main", {path: "__farmoreos__/art/item-group.png", size: 32}),
};
const subgroup = {
    tools: itemSubgroup(group.main, "tools"),
    seeds: itemSubgroup(group.main, "seeds"),
    vegetables: itemSubgroup(group.main, "vegetables"),
    intermediates: itemSubgroup(group.main, "intermediates"),
    research: itemSubgroup(group.main, "research"),
};
const fluid = {
    water: id("fluid", "water"),
};
const item = {
    wood: id("item", "wood"),
    iron_plate: id("item", "iron-plate"),
    ice: id("item", "ice"),
    kale_seeds: quickItem(subgroup.seeds, "kale-seeds", {path: "__farmoreos__/art/kale-seeds.png", size: 64}, {}),
    kale_leaf: quickItem(subgroup.vegetables, "kale-leaf", {path: "__farmoreos__/art/kale-leaf2.png", size: 64}, {contaminable: true, edible: 5}),
    kale_smoothie: quickItem(subgroup.research, "kale-smoothie", {path: "__farmoreos__/art/kale-smoothie.png", size: 64}, {contaminable: true, researchable: true}),
    watering_can_empty: quickItem(subgroup.tools, "watering-can-empty", {path: "__farmoreos__/art/watering-can-empty.png", size: 32}, {}),
    watering_can_full: quickItem(subgroup.tools, "watering-can", {path: "__farmoreos__/art/watering-can.png", size: 32}, {}),
    hoe: quickItem(subgroup.tools, "hoe", {path: "__farmoreos__/art/hoe.png", size: 32}, {}),

    wheat_seeds: quickItem(subgroup.seeds, "wheat-seeds", {path: "__farmoreos__/art/wheat-seeds.png", size: 32}, {}),
    wheat_grain: quickItem(subgroup.seeds, "wheat-grain", {path: "__farmoreos__/art/wheat.png", size: 32}, {}),
    flour: quickItem(subgroup.seeds, "flour", {path: "__farmoreos__/art/flour.png", size: 32}, {}),
    dough_unrisen: quickItem(subgroup.seeds, "dough-unrisen", {path: "__farmoreos__/art/dough-unrisen.png", size: 32}, {}),
    dough_risen: quickItem(subgroup.seeds, "dough-unrisen", {path: "__farmoreos__/art/dough-risen.png", size: 32}, {}),
    bread: quickItem(subgroup.seeds, "bread", {path: "__farmoreos__/art/bread.png", size: 32}, {}),
    bread_slice: quickItem(subgroup.seeds, "bread-slice", {path: "__farmoreos__/art/bread-slice.png", size: 32}, {}),
    toast: quickItem(subgroup.seeds, "toast", {path: "__farmoreos__/art/toast.png", size: 32}, {}),

    charcoal: quickItem(subgroup.intermediates, "charcoal", {path: "__farmoreos__/art/empty.png", size: 1}, {}),
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

    wheat_seeds: quickRecipe(subgroup.seeds, "wheat-seeds", recipe_category.crafting, {
        sec: 1,
        from: [{name: item.kale_seeds, amount: 10}],
        to: [{name: item.wheat_seeds, amount: 1}],
    }),
    wheat_grain: quickRecipe(subgroup.vegetables, "wheat-grain", recipe_category.growing, {
        sec: 8 * day_to_seconds,
        from: [{name: item.wheat_seeds, amount: 1}],
        to: [
            {name: item.wheat_grain, amount: 10},
            {name: item.wheat_seeds, amount: 1, extra_count_fraction: 0.1}, // odd because wheat grains are seeds
        ],
    }),
    flour: quickRecipe(subgroup.intermediates, "flour", recipe_category.milling, {
        sec: 60,
        from: [{name: item.wheat_grain, amount: 1}],
        to: [{name: item.flour, amount: 1}],
    }),
    dough_unrisen: quickRecipe(subgroup.intermediates, "dough-unrisen", recipe_category.mixing, {
        sec: 10,
        from: [{name: item.flour, amount: 20}, {name: fluid.water, amount: 5}],
        to: [{name: item.dough_unrisen, amount: 1}],
    }),
    dough_risen: quickRecipe(subgroup.intermediates, "dough-risen", recipe_category.waiting, {
        sec: 20,
        from: [{name: item.dough_unrisen, amount: 1}],
        to: [{name: item.dough_risen, amount: 1}],
    }),
    bread: quickRecipe(subgroup.intermediates, "bread", recipe_category.cooking, {
        sec: 5,
        from: [{name: item.dough_risen, amount: 1}],
        to: [{name: item.bread, amount: 1}],
    }),
    bread_burning: quickRecipe(subgroup.intermediates, "bread-burning", recipe_category.cooking, {
        sec: 12,
        from: [{name: item.bread, amount: 1}],
        to: [{name: item.charcoal, amount: 1}],
    }),
    bread_slice: quickRecipe(subgroup.intermediates, "bread_slice", recipe_category.slicing, {
        sec: 4,
        from: [{name: item.bread, amount: 1}],
        to: [{name: item.bread_slice, amount: 20}],
    }),
    toast: quickRecipe(subgroup.intermediates, "toast", recipe_category.cooking, {
        sec: 2,
        from: [{name: item.bread_slice, amount: 1}],
        to: [{name: item.toast, amount: 1}],
    }),
    toast_burning: quickRecipe(subgroup.intermediates, "toast-burning", recipe_category.cooking, {
        sec: 1,
        from: [{name: item.toast, amount: 1}],
        to: [{name: item.charcoal, amount: 1}],
    }),
};

const technology_basic_farming = quickTechnology("basic-farming", {
    essential: true,
    icon: {path: "__farmoreos__/art/kale-leaf.png", size: 64},
    cost: {
        // TODO: this one should depend on mining 40 wood?
        items: [id("item", "automation-science-pack")],
        count: 1,
        time: 1,
    },
    prerequisites: [],
    effects: [
        recipes.watering_can_empty,
        recipes.watering_can_full,
        recipes.hoe,
        recipes.kale_seeds,
        recipes.kale_leaf,
        // recipes.bioconsumer,
    ],
});

const technology_kale_smoothie = quickTechnology("kale-smoothie", {
    essential: true,
    icon: {path: "__farmoreos__/art/kale-smoothie.png", size: 64},
    cost: {
        // TODO: this one should depend on crafting a bioconsumer
        items: [id("item", "automation-science-pack")],
        count: 1,
        time: 1,
    },
    prerequisites: [technology_basic_farming],
    effects: [
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
const technology_wheat = quickTechnology("wheat", {
    essential: true,
    icon: {path: "__farmoreos__/art/bread.png", size: 32},
    cost: {
        items: [item.kale_smoothie],
        count: 2000,
        time: 10,
    },
    prerequisites: [technology_kale_smoothie],
    effects: [
        recipes.wheat_seeds,
        recipes.wheat_grain,
    ],
});
// quickTechnology("basic-milling", {
//     essential: true,
//     icon: {path: "__farmoreos__/art/bread.png", size: 32},
//     cost: {
//         items: [item.kale_smoothie],
//         count: 2000,
//         time: 10,
//     },
//     unlocks: [
//         recipes.gristmill,
//         recipes.wheat_grain,
//     ],
// });
// quickTechnology("bread-baking", {
//     essential: true,
//     icon: {path: "__farmoreos__/art/bread.png", size: 32},
//     cost: {
//         items: [item.kale_smoothie],
//         count: 2000,
//         time: 10,
//     },
//     dependencies: [],
//     unlocks: [
//         recipes.flour,
//         recipes.dough_unrisen,
//         recipes.dough_risen,
//         recipes.bread,
//         recipes.bread_slice,
//         recipes.toast,
//         recipes.toast_slice,
//     ],
// });
// quickTechnology("peanuts", {});
// quickTechnology("jam", {});