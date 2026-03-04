import { LuaGameScript } from "factorio:runtime";

declare const game: LuaGameScript;

script.on_event(defines.events.on_lua_shortcut, event => {
    if (event.prototype_name == "farmoreos-cheat") {
        const player = game.get_player(event.player_index);
        if (!player) return;
        player.cheat_mode = !player.cheat_mode;
    } else if (event.prototype_name === "farmoreos-reload-mods") {
        game.reload_mods();
    }
});
script.on_event(defines.events.on_player_created, event => {
    const player = game.get_player(event.player_index);
    if (!player) return;
    player.set_shortcut_toggled("farmoreos-cheat", player.cheat_mode);
});
script.on_event(defines.events.on_player_cheat_mode_disabled, event => {
    const player = game.get_player(event.player_index);
    if (!player) return;
    player.set_shortcut_toggled("farmoreos-cheat", player.cheat_mode);
});
script.on_event(defines.events.on_player_cheat_mode_enabled, event => {
    const player = game.get_player(event.player_index);
    if (!player) return;
    player.set_shortcut_toggled("farmoreos-cheat", player.cheat_mode);
});

script.on_event(defines.events.on_player_used_capsule, event => {
    if (event.item.name === "farmoreos-watering-can-empty") {
        const player = game.get_player(event.player_index);
        if (!player) return;
        if (player.cursor_stack?.name != "farmoreos-watering-can-empty") return;
        const tile = player.surface.get_tile(event.position);
        if (tile.prototype.fluid?.name === "water") {
            player.cursor_stack.set_stack({name: "farmoreos-watering-can", count: 1, durability: 50});
        } else {
            player.create_local_flying_text({
                text: ["error.farmoreos-no-water"],
                color: {r: 1, g: 0, b: 0},
                position: event.position,
            });
        }
    }
});
script.on_event(defines.events.on_player_built_tile, event => {
    if (event.item?.name === "farmoreos-hoe") {
        const player = game.get_player(event.player_index);
        if (!player) return;
        player.cursor_stack?.set_stack({name: "farmoreos-hoe", count: event.tiles.length});
    }
});

function dump(a: any) {
    game.print(serpent.block(a));
}