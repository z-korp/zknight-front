#[system]
mod Create {
    use array::{ArrayTrait, SpanTrait};
    use traits::Into;

    use dojo::world::{Context, IWorld};

    use zknight::components::game::{Game, GameTrait};
    use zknight::components::map::{Map, MapTrait, Type};
    use zknight::components::tile::{Tile};
    use zknight::components::character::Character;

    use zknight::constants::{KNIGHT_HEALTH, MOB_HEALTH};

    fn execute(ctx: Context, player: felt252, seed: felt252, name: felt252) {
        // [Command] Game entity
        let game_id = ctx.world.uuid();
        let mut game = GameTrait::new(player, game_id, seed);
        set!(ctx.world, (game));

        // [Command] Map entity
        let map = MapTrait::new(game_id, 1, name);
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
            let tile = Tile { game_id, level: map.level, x, y, index, _type: raw_type };

            // [Command] Set Tile and Character entities
            match tile_type {
                Type::Ground(()) => {//
                },
                Type::Hole(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                },
                Type::Knight(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                    // [Command] Set Character entity
                    let knight = Character {
                        game_id: game_id,
                        _type: raw_type,
                        health: KNIGHT_HEALTH,
                        index,
                        hitter: 0,
                        hit: 0
                    };
                    set!(ctx.world, (knight));
                },
                Type::Barbarian(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                    // [Command] Set Character entity
                    let barbarian = Character {
                        game_id: game_id,
                        _type: raw_type,
                        health: MOB_HEALTH,
                        index,
                        hitter: 0,
                        hit: 0
                    };
                    set!(ctx.world, (barbarian));
                },
                Type::Bowman(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                    // [Command] Set Character entity
                    let bowman = Character {
                        game_id: game_id,
                        _type: raw_type,
                        health: MOB_HEALTH,
                        index,
                        hitter: 0,
                        hit: 0
                    };
                    set!(ctx.world, (bowman));
                },
                Type::Wizard(()) => {
                    // [Command] Set Tile entity
                    set!(ctx.world, (tile));
                    // [Command] Set Character entity
                    let wizard = Character {
                        game_id: game_id,
                        _type: raw_type,
                        health: MOB_HEALTH,
                        index,
                        hitter: 0,
                        hit: 0
                    };
                    set!(ctx.world, (wizard));
                },
            };

            index += 1;
        }
    }
}
