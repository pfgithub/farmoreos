import { LuaEntity, LuaGameScript, LuaPrototypes, LuaSurface, TileWrite } from "factorio:runtime";
import { day_to_ticks } from "./constants";

declare const game: LuaGameScript;
declare const storage: {
    queue?: Queue,
};
declare const prototypes: LuaPrototypes;

type Queue = {
    start: number,
    end: number,
    entries: QueueItem[],
};
type QueueItem = {
    k: "uw", // uw = "unwater"
    t: number, // game.tick
    s: string, // surface
    p: [number, number][],
};
function getQueue(): Queue {
    storage.queue ??= {start: 0, end: 0, entries: []};
    return storage.queue;
}
function queueEnqueue(queue: Queue, item: QueueItem) {
    queue.entries[queue.end] = item;
    queue.end += 1;
}
function queuePeek(queue: Queue): QueueItem | undefined {
    return queue.entries[queue.start];
}
function queueDequeue(queue: Queue): QueueItem | undefined {
    const value = queuePeek(queue);
    if (value == undefined) return;
    delete queue.entries[queue.start];
    queue.start += 1;
    return value;
}

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
        } else if (tile.prototype.collision_mask.layers.farmoreos_farmable) {
            player.create_local_flying_text({
                text: ["error.farmoreos-out-of-water"], // @name error.farmoreos-out-of-water=Out of water. Must refill.
                color: {r: 1, g: 0, b: 0},
                position: event.position,
            });
        } else {
            player.create_local_flying_text({
                text: ["error.farmoreos-no-water"], // @name error.farmoreos-no-water=Not water
                color: {r: 1, g: 0, b: 0},
                position: event.position,
            });
        }
    } else if (event.item.name === "farmoreos-hoe") {
        const player = game.get_player(event.player_index);
        if (!player) return;
        const tile = player.surface.get_tile(event.position);
        if (tile.prototype.collision_mask.layers.farmoreos_farmable) {
            const hidden_tile = player.surface.get_hidden_tile(event.position);
            if (hidden_tile == null) return; // uh oh!
            const dbl_hidden_tile = player.surface.get_double_hidden_tile(event.position);
            player.surface.set_double_hidden_tile(event.position, undefined);
            player.surface.set_hidden_tile(event.position, dbl_hidden_tile);
            player.surface.set_tiles([{name: hidden_tile, position: event.position}]);
            updateGrowth(player.surface, event.position.x, event.position.y);
        } else if (!tile.prototype.fluid) {
            player.surface.set_tiles([{name: "farmoreos-farmland-dry", position: event.position}], true, "abort_on_collision", true, true, player);
            updateGrowth(player.surface, event.position.x, event.position.y);
        } else {
            player.create_local_flying_text({
                text: ["error.farmoreos-hoe-water"], //@name error.farmoreos-hoe-water=Cannot hoe fluid
                color: {r: 1, g: 0, b: 0},
                position: event.position,
            });
        }
    } else if (event.item.name === "farmoreos-watering-can") {
        const player = game.get_player(event.player_index);
        if (!player) return;
        if (player.cursor_stack?.name != "farmoreos-watering-can") return;

        const tile = player.surface.get_tile(event.position);
        if (tile.prototype.fluid?.name === "water") {
            player.cursor_stack.set_stack({name: "farmoreos-watering-can", health: 1});
            return;
        }

        const new_health = player.cursor_stack.health - (1 / 50);
        if (new_health <= 0) {
            player.cursor_stack.set_stack({name: "farmoreos-watering-can-empty"});
        }else {
            player.cursor_stack.set_stack({name: "farmoreos-watering-can", health: new_health});
        }

        player.surface.create_particle({
            name: "tintable-water-particle",
            position: event.position,
            movement: [0, 0.01],
            height: 0, vertical_speed: 0.01, frame_speed: 1,
        });

        if (tile.name === "farmoreos-farmland-dry") {
            player.surface.set_tiles([{name: "farmoreos-farmland-wet", position: event.position}], true, "abort_on_collision", true, true, player);
            queueEnqueue(getQueue(), {k: "uw", t: game.tick + day_to_ticks * 1, s: player.surface.name, p: [[math.floor(event.position.x), math.floor(event.position.y)]]});
        }
        updateGrowth(player.surface, event.position.x, event.position.y);
    }
});
script.on_event(defines.events.on_player_built_tile, event => {
    if (event.item?.name === "farmoreos-hoe") {
        const player = game.get_player(event.player_index);
        if (!player) return;
        player.cursor_stack?.set_stack({name: "farmoreos-hoe", count: event.tiles.length});
    }
});

const wet_crop_names = new Set(["farmoreos-wheat"]);
const dry_crop_names = new Set();
for (const crop_name of wet_crop_names) {
    dry_crop_names.add(crop_name + "-unwatered");
}

script.on_event(defines.events.on_built_entity, event => {
    updateGrowthPlant(event.entity);
});


function updateGrowth(surface: LuaSurface, x: number, y: number) {
    x = math.floor(x);
    y = math.floor(y);
    const entities = surface.find_entities_filtered({area: [[x, y], [x + 1, y + 1]], type: "plant"});
    for (const entity of entities) {
        updateGrowthPlant(entity);
    }
}
function updateGrowthPlant(entity: LuaEntity) {
    const surface = entity.surface;
    if (wet_crop_names.has(entity.name)) {
        const tile = surface.get_tile(entity.position);
        if (tile.name !== "farmoreos-farmland-wet") {
            replacePlant(entity, entity.name + "-unwatered");
        }
    } else if (dry_crop_names.has(entity.name)) {
        const tile = surface.get_tile(entity.position);
        if (tile.name === "farmoreos-farmland-wet") {
            replacePlant(entity, entity.name.substring(0, entity.name.length - "-unwatered".length));
        }
    }
}
function replacePlant(entity: LuaEntity, next_name: string) {
    const current_health = entity.health;
    const current_position = [entity.position.x, entity.position.y] as const;
    const current_growth_duration = entity.prototype.growth_ticks!;
    const next_growth_duration = prototypes.entity[next_name]!.growth_ticks!;
    const current_growth = current_growth_duration - (entity.tick_grown - game.tick);
    const next_growth = current_growth / current_growth_duration * next_growth_duration;
    const surface = entity.surface;
    entity.destroy();
    const created = surface.create_entity({
        name: next_name,
        position: current_position,
        tick_grown: next_growth_duration - next_growth + game.tick,
        // player: current_player,
    });
    if (created) {
        created.health = current_health;
    }
}

function executeQueueItem(item: QueueItem) {
    if (item.k !== "uw") return;
    const surface = game.get_surface(item.s);
    if (!surface) return;
    const set_tiles: TileWrite[] = [];
    for (const position of item.p) {
        const tile = surface.get_tile(position[0], position[1]);
        if (tile.name !== "farmoreos-farmland-wet") continue;
        set_tiles.push({name: "farmoreos-farmland-dry", position});
    }
    surface.set_tiles(set_tiles);
    for (const position of item.p) {
        updateGrowth(surface, position[0], position[1]);
    }
}

script.on_event(defines.events.on_tick, event => {
    const queue = getQueue();
    for (let i = 0; i < 2; i += 1) {
        const peek = queuePeek(queue);
        if (!peek || peek.t > game.tick) break;
        queueDequeue(queue);
        executeQueueItem(peek);
    }
});

function dump(a: any) {
    game.print(serpent.block(a));
}