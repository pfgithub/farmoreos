import { LuaGameScript } from "factorio:runtime";

declare const game: LuaGameScript;

script.on_event(defines.events.on_player_changed_position, event => {
    const player = game.get_player(event.player_index); // get the player that moved            
    if (!player) return;
    // -- if they're currently controlling the character
    if (player.controller_type == defines.controllers.character) {
        //   -- and wearing our armor
        if ((player.get_inventory(defines.inventory.character_armor)?.get_item_count("fire-armor") ?? 0) >= 1) {
            // -- create the fire where they're standing
            player.surface.create_entity({name: "fire-flame", position: player.position, force: "neutral"});
        }
    }
});

script.on_event(defines.events.on_lua_shortcut, event => {
    if (event.prototype_name == "farmoreos-cheat") {
        const player = game.get_player(event.player_index);
        if (!player) return;
        player.cheat_mode = !player.cheat_mode;
        player.set_shortcut_toggled("farmoreos-cheat", player.cheat_mode);
    } else if (event.prototype_name === "farmoreos-reload-mods") {
        game.reload_mods();
    }
});