mod Setup {
    use core::traits::Into;
    use array::ArrayTrait;

    use starknet::ContractAddress;

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::test_utils::spawn_test_world;

    use zknight::components::game::{game, Game};
    use zknight::components::map::{map, Map};
    use zknight::components::tile::{tile, Tile};
    use zknight::components::character::{character, Character};
    use zknight::systems::create::Create;
    use zknight::systems::play::Play;
    use zknight::systems::spawn::Spawn;

    fn spawn_game() -> IWorldDispatcher {
        // [Setup] Components
        let mut components = array::ArrayTrait::new();
        components.append(game::TEST_CLASS_HASH);
        components.append(map::TEST_CLASS_HASH);
        components.append(character::TEST_CLASS_HASH);

        // [Setup] Systems
        let mut systems = array::ArrayTrait::new();
        systems.append(Create::TEST_CLASS_HASH);
        systems.append(Play::TEST_CLASS_HASH);
        systems.append(Spawn::TEST_CLASS_HASH);

        // [Deploy]
        spawn_test_world(components, systems)
    }
}
