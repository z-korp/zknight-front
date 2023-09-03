use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    player: ContractAddress,
    game_id: u32,
    score: u8,
    over: bool,
    seed: felt252,
}

trait GameTrait {
    fn new(player: ContractAddress, game_id: u32, seed: felt252) -> Game;
}

impl GameImpl of GameTrait {
    fn new(player: ContractAddress, game_id: u32, seed: felt252) -> Game {
        Game {
            player: player,
            game_id: game_id,
            score: 0,
            over: false,
            seed: seed,
        }
    }
}