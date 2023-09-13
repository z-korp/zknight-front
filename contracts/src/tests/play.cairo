mod Tests {
    use traits::{Into, TryInto};
    use core::result::ResultTrait;
    use array::{ArrayTrait, SpanTrait};
    use option::OptionTrait;
    use box::BoxTrait;
    use clone::Clone;
    use debug::PrintTrait;

    use starknet::{ContractAddress, syscalls::deploy_syscall};
    use starknet::class_hash::{ClassHash, Felt252TryIntoClassHash};
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    use dojo::test_utils::spawn_test_world;

    use zknight::constants::{
        SEED, NAME, PLAYER, KNIGHT_HEALTH, MOB_HEALTH, GROUND_TYPE, HOLE_TYPE, KNIGHT_TYPE,
        BARBARIAN_TYPE, BOWMAN_TYPE, WIZARD_TYPE
    };
    use zknight::components::game::Game;
    use zknight::components::map::{Map, MapTrait, Type, _compose, _decompose};
    use zknight::components::tile::{Tile, TileTrait};
    use zknight::components::character::{Character};
    use zknight::tests::setup::Setup;

    #[test]
    #[available_gas(1_000_000_000)]
    fn test_play() {
        // [Setup]
        let world = Setup::spawn_game();

        // [Create]
        world.execute('Create', array![PLAYER, SEED, NAME]);

        // [Assert] Game
        let game = get!(world, PLAYER, (Game));
        assert(game.game_id == 0, 'Wrong game id');
        assert(game.seed == SEED, 'Wrong seed');

        // [Assert] Map
        let map = get!(world, game.game_id, (Map));
        assert(map.level == 1, 'Wrong map id');
        assert(map.score == 0, 'Wrong score');
        assert(map.name == NAME, 'Wrong name');

        // [Assert] Knight Character
        let knight_char = get!(world, (game.game_id, KNIGHT_TYPE).into(), (Character));
        assert(knight_char.health == KNIGHT_HEALTH, 'Wrong knight health');
        assert(knight_char.index == 7 + map.size * 2, 'Wrong knight index');

        // [Assert] Barbarian Character
        let barbarian_char = get!(world, (game.game_id, BARBARIAN_TYPE).into(), (Character));
        assert(barbarian_char.health == MOB_HEALTH, 'Wrong barbarian health');
        assert(barbarian_char.index == 6 + map.size * 2, 'Wrong barbarian index');

        // [Assert] Bowman Character
        let bowman_char = get!(world, (game.game_id, BOWMAN_TYPE).into(), (Character));
        assert(bowman_char.health == MOB_HEALTH, 'Wrong bowman health');
        assert(bowman_char.index == 2 + map.size * 4, 'Wrong bowman index');

        // [Play] Attack
        let target_tile = TileTrait::new(6, 2);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);

        // [Assert] Barbarian Character
        let barbarian_char = get!(world, (game.game_id, BARBARIAN_TYPE).into(), (Character));
        assert(barbarian_char.health == 0, 'Wrong barbarian health');

        // [Assert] Barbarian Tile doesn't exist anymore
        let barbarian_tile = get!(
            world, (game.game_id, map.level, barbarian_char.index).into(), (Tile)
        );
        assert(barbarian_tile._type == GROUND_TYPE, 'Wrong barbarian type');

        // [Assert] Bowman Character
        let bowman_char = get!(world, (game.game_id, BOWMAN_TYPE).into(), (Character));
        assert(bowman_char.health == MOB_HEALTH, 'Wrong bowman health');
        assert(bowman_char.index == 2 + map.size * 3, 'Wrong bowman index');

        // [Play] Move
        let target_tile = TileTrait::new(6, 2);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);

        // [Assert] Knight Character
        let knight_char = get!(world, (game.game_id, KNIGHT_TYPE).into(), (Character));
        assert(knight_char.health == KNIGHT_HEALTH, 'Wrong knight health');
        assert(knight_char.index == 6 + map.size * 2, 'Wrong knight index');

        // [Assert] Knight Tile
        let knight_tile = get!(world, (game.game_id, map.level, knight_char.index).into(), (Tile));
        assert(knight_tile._type == KNIGHT_TYPE, 'Wrong new knight type');
        assert(knight_tile.x == target_tile.x, 'Wrong new knight x');
        assert(knight_tile.y == target_tile.y, 'Wrong new knight y');

        // [Assert] Bowman Character
        let bowman_char = get!(world, (game.game_id, BOWMAN_TYPE).into(), (Character));
        assert(bowman_char.health == MOB_HEALTH, 'Wrong bowman health');
        assert(bowman_char.index == 2 + map.size * 2, 'Wrong bowman index');

        // [Assert] Bowman Tile
        let bowman_tile = get!(world, (game.game_id, map.level, bowman_char.index).into(), (Tile));
        assert(bowman_tile._type == BOWMAN_TYPE, 'Wrong bowman type');
        assert(bowman_tile.x == 2, 'Wrong bowman x');
        assert(bowman_tile.y == 2, 'Wrong bowman y');

        // [Assert] Game
        let map = get!(world, game.game_id, (Map));
        assert(map.score == 9, 'Wrong score');
    }

    #[test]
    #[available_gas(1_000_000_000)]
    fn test_pass() {
        // [Setup]
        let world = Setup::spawn_game();

        // [Create]
        world.execute('Create', array![PLAYER, SEED, NAME]);
        let game = get!(world, PLAYER, (Game));
        let map = get!(world, game.game_id, (Map));

        // [Assert] Knight Character
        let knight_char = get!(world, (game.game_id, KNIGHT_TYPE).into(), (Character));
        assert(knight_char.health == KNIGHT_HEALTH, 'Wrong knight health');
        assert(knight_char.index == 7 + map.size * 2, 'Wrong knight index');

        // [Play] Pass
        let target_tile = TileTrait::new(7, 2);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);

        // [Assert] Knight Character
        let knight_char = get!(world, (game.game_id, KNIGHT_TYPE).into(), (Character));
        assert(knight_char.health == KNIGHT_HEALTH - 1, 'Wrong knight health');
        assert(knight_char.index == 7 + map.size * 2, 'Wrong knight index');
    }

    #[test]
    #[available_gas(1_000_000_000)]
    fn test_spawn() {
        // [Setup]
        let world = Setup::spawn_game();

        // [Create] Generate
        let seed = 1000;
        world.execute('Create', array![PLAYER, seed, NAME]);

        // [Play] Attack
        let target_tile = TileTrait::new(7, 2);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(7, 1);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(6, 1);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(6, 0);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(5, 0);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(4, 0);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(4, 1);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Attack
        let target_tile = TileTrait::new(4, 2);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(4, 2);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Attack
        let target_tile = TileTrait::new(4, 3);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);

        // [Assert] Game
        let game = get!(world, PLAYER, (Game));
        assert(game.game_id == 0, 'Wrong game id');
        assert(game.over == false, 'Wrong over status');

        // [Assert] Barbarian Character
        let barbarian_char = get!(world, (game.game_id, BARBARIAN_TYPE).into(), (Character));
        assert(barbarian_char.health == 0, 'Wrong barbarian health');

        // [Assert] Map
        let map = get!(world, game.game_id, (Map));
        assert(map.level == 2, 'Wrong map id');
        assert(map.spawn == false, 'Wrong spawn');
        assert(map.score == 29, 'Wrong score');

        // [Spawn]
        world.execute('Spawn', array![PLAYER]);

        // [Assert] Map
        let map = get!(world, game.game_id, (Map));
        assert(map.spawn == true, 'Wrong spawn');

        // [Assert] Barbarian Character
        let barbarian_char = get!(world, (game.game_id, BARBARIAN_TYPE).into(), (Character));
        assert(barbarian_char.health == MOB_HEALTH, 'Wrong barbarian health');
    }

    #[test]
    #[available_gas(1_000_000_000)]
    fn test_team_kill() {
        // [Setup]
        let world = Setup::spawn_game();

        // [Create] Generate
        let seed = 1000;
        world.execute('Create', array![PLAYER, seed, NAME]);

        // [Play] Move
        let target_tile = TileTrait::new(6, 3);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(5, 3);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(5, 4);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Move
        let target_tile = TileTrait::new(5, 5);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);
        // [Play] Pass
        let target_tile = TileTrait::new(5, 5);
        world.execute('Play', array![PLAYER, target_tile.x.into(), target_tile.y.into()]);

        // [Assert] Barbarian Character
        let game = get!(world, PLAYER, (Game));
        let barbarian_char = get!(world, (game.game_id, BARBARIAN_TYPE).into(), (Character));
        assert(barbarian_char.health == 0, 'Wrong barbarian health');

        // [Assert] Map
        let map = get!(world, game.game_id, (Map));
        assert(map.score == 10, 'Wrong score');
    }
}
