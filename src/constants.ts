export const day_to_ticks = 25200;
export const day_to_seconds = day_to_ticks / 60;
export const hour_to_seconds = day_to_seconds / 24
export const hour_to_ticks = hour_to_seconds * 60;

export type ContaminationItem = {name: string, mode: "food-belt" | "cook-belt"};
export const contamination_items: ContaminationItem[] = [
    {name: "farmoreos-flour", mode: "food-belt"},
    {name: "farmoreos-dough-unrisen", mode: "food-belt"},
    {name: "farmoreos-dough-unrisen-cooking", mode: "cook-belt"},
    {name: "farmoreos-dough-risen", mode: "food-belt"},
    {name: "farmoreos-dough-risen-cooking", mode: "cook-belt"},
    {name: "farmoreos-bread", mode: "food-belt"},
    {name: "farmoreos-bread-cooking", mode: "cook-belt"},
    {name: "farmoreos-bread-slice", mode: "food-belt"},
    {name: "farmoreos-bread-slice-cooking", mode: "cook-belt"},
    {name: "farmoreos-toast", mode: "food-belt"},
    {name: "farmoreos-toast-cooking", mode: "cook-belt"},
];