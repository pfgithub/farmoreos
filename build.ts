import {cpSync, mkdirSync, rmSync} from "fs";
const mod_name = "farmoreos";
console.log("clear...");
rmSync("dist", {force: true, recursive: true});
console.log("src...");
mkdirSync("dist/src", {recursive: true});
cpSync("src", "dist/src", {recursive: true});
console.log("tstl...");
// @ts-ignore
Bun.spawnSync({
    cmd: ["bun", "tstl", "-p", "tsconfig.json", "--luaLibImport", "require"],
    stdio: ["inherit", "inherit", "inherit"],
});
console.log("info.json");
// @ts-ignore
await Bun.write("dist/src/info.json", JSON.stringify({
    "name": mod_name,
    "version": "0.1.0",
    "title": "Farmoreos",
    "author": "pfg",
    "factorio_version": "2.0",
    "dependencies": ["base >= 2.0"],
    "description": "Farming mod for Factorio."
}));
// copy to mods folder
const mods_folder = "C:\\Users\\pfg\\AppData\\Roaming\\Factorio\\mods";
console.log("clear factorio mod...");
rmSync(mods_folder + "/" + mod_name, {force: true, recursive: true});
console.log("write factorio mod...");
cpSync("dist/src", mods_folder + "/farmoreos", {recursive: true});
console.log("done");