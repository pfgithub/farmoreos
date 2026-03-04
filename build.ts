import {cpSync, mkdirSync, readdirSync, rmSync} from "fs";
const mod_name = "farmoreos";
console.log("clear...");
rmSync("dist", {force: true, recursive: true});
console.log("src...");
mkdirSync("dist", {recursive: true});
cpSync("src/art", "dist/art", {recursive: true});
console.log("tstl...");
// @ts-ignore
Bun.spawnSync({
    cmd: ["bun", "tstl", "-p", "tsconfig.json", "--luaLibImport", "require"],
    stdio: ["inherit", "inherit", "inherit"],
});
console.log("info.json");
// @ts-ignore
await Bun.write("dist/info.json", JSON.stringify({
    "name": mod_name,
    "version": "0.1.0",
    "title": "Farmoreos",
    "author": "pfg",
    "factorio_version": "2.0",
    "dependencies": ["base >= 2.0"],
    "description": "Farming mod for Factorio.",
    "spoiling_required": true,
}));
// generate locale
const all_src = readdirSync("src", {recursive: true});
const gen_locale: Map<string, Map<string, string>> = new Map();
for (const src_file of all_src) {
    if (typeof src_file !== "string") continue;
    if (src_file.startsWith(".")) continue;
    if (!src_file.endsWith(".ts")) continue;
    // @ts-ignore
    const content: string = await Bun.file("src/"+src_file).text();
    const names = content.matchAll(/\/\/\s*@name([^\n]+)\n/g)
    for (const [, content] of names) {
        // @ts-ignore
        const [, category, key, value] = content.match(/^\s+([^=. ]+)\.([^= ]+)=(.+)$/) ?? (() => {
            throw new Error("bad name on line "+content);
        });
        if (!gen_locale.has(category)) gen_locale.set(category, new Map());
        const cat = gen_locale.get(category)!;
        if (cat.has(key)) throw new Error(`duplicate ${category}.${key}`);
        cat.set(key, value);
    }
}
// bundle fix
// @ts-ignore
await Bun.write("dist/locale/en/locale.cfg", [...gen_locale.entries()].map(([category, values]) => {
    return `[${category}]` + [...values.entries()].map(([k, v]) => `\n${k}=${v}`).join("");
}).join("\n\n"));
// file location fix
for (const name of ["control", "data", "settings"]) {
    // @ts-ignore
    if (await Bun.file(`dist/src/${name}.lua`).exists()) {
        // @ts-ignore
        await Bun.write(`dist/${name}.lua`, `return require("src.${name}")`);
    }
}
// copy to mods folder
const mods_folder = "C:\\Users\\pfg\\AppData\\Roaming\\Factorio\\mods";
console.log("clear factorio mod...");
rmSync(mods_folder + "/" + mod_name, {force: true, recursive: true});
console.log("write factorio mod...");
cpSync("dist", mods_folder + "/farmoreos", {recursive: true});
console.log("done");