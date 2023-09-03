#[system]
mod Spawn {
    use array::{ArrayTrait, SpanTrait};
    use traits::Into;

    use dojo::world::{Context, IWorld};

    use zknight::components::game::{Game, GameTrait};
    use zknight::components::map::{Map, MapTrait, Type};
    use zknight::components::tile::{Tile};
    use zknight::components::character::{Character, CharacterTrait};

    use zknight::constants::{KNIGHT_HEALTH, MOB_HEALTH};

    fn execute(ctx: Context) {
        // [Command] Game entity
        let game = get!(ctx.world, ctx.origin, (Game));

        // [Check] Map must not be spawned
        let mut map = get!(ctx.world, game.game_id, (Map));
        assert(!map.spawn, 'Map must not be spawned');

        // [Command] Map entity
        map.spawn = true;
        set!(ctx.world, (map));

        // [Command] Characters and Tiles
        let raw_types = map.generate(game.seed);
        let mut index = 0;
        let length = raw_types.len();
        loop {
            if index == length {
                break;
            }

            let raw_type = *raw_types[index];
            let tile_type = map.get_type(raw_type);
            let (x, y) = map.decompose(index);
            let tile = Tile { game_id: game.game_id, level: map.level, x, y, index, _type: raw_type};

            // [Command] Set Tile and Character entities
            match tile_type {
                Type::Ground(()) => {
                    //
                },
                Type::Hole(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                },
                Type::Knight(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                    // [Command] Update Character entity
                    let key = (game.game_id, CharacterTrait::get_knight_type());
                    let mut character = get!(ctx.world, key.into(), (Character));
                    character.index = index;
                    character.hitter = 0;
                    character.hit = 0;
                    set!(ctx.world, (character));
                },
                Type::Barbarian(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                    // [Command] Update Character entity
                    let key = (game.game_id, CharacterTrait::get_barbarian_type());
                    let mut character = get!(ctx.world, key.into(), (Character));
                    character.health = MOB_HEALTH;
                    character.index = index;
                    character.hitter = 0;
                    character.hit = 0;
                    set!(ctx.world, (character));
                },
                Type::Bowman(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                    // [Command] Update Character entity
                    let key = (game.game_id, CharacterTrait::get_bowman_type());
                    let mut character = get!(ctx.world, key.into(), (Character));
                    character.health = MOB_HEALTH;
                    character.index = index;
                    character.hitter = 0;
                    character.hit = 0;
                    set!(ctx.world, (character));
                },
                Type::Wizard(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                    // [Command] Update Character entity
                    let key = (game.game_id, CharacterTrait::get_wizard_type());
                    let mut character = get!(ctx.world, key.into(), (Character));
                    character.health = MOB_HEALTH;
                    character.index = index;
                    character.hitter = 0;
                    character.hit = 0;
                    set!(ctx.world, (character));
                },
            };

            index +=1;
        }
    }
}