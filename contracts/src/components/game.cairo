use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    player: felt252,
    game_id: u32,
    over: bool,
    seed: felt252,
}

trait GameTrait {
    fn new(player: felt252, game_id: u32, seed: felt252) -> Game;
    fn set_over(ref self: Game, over: bool);
}

impl GameImpl of GameTrait {
    fn new(player: felt252, game_id: u32, seed: felt252) -> Game {
        Game { player: player, game_id: game_id, over: false, seed: seed, }
    }

    fn set_over(ref self: Game, over: bool) {
        self.over = true;
    }
}
