use array::SpanTrait;

use zknight::constants::{KNIGHT_TYPE, BARBARIAN_TYPE, BOWMAN_TYPE, WIZARD_TYPE};
use zknight::components::tile::Tile;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Character {
    #[key]
    game_id: u32,
    #[key]
    _type: u8,
    health: u8,
    index: u32,
    hitter: u8,
    hit: u8,
}

trait CharacterTrait {
    fn new(health: u8) -> Character;
    fn get_knight_type() -> u8;
    fn get_barbarian_type() -> u8;
    fn get_bowman_type() -> u8;
    fn get_wizard_type() -> u8;
    fn is_dead(self: Character) -> bool;
    fn take_damage(ref self: Character, hitter: u8, damage: u8);
    fn reset_damage(ref self: Character);
}

impl CharacterImpl of CharacterTrait {
    fn new(health: u8) -> Character {
        Character {
            game_id: 0,
            _type: 0,
            health: health,
            index: 0,
            hitter: 0,
            hit: 0,
        }
    }
    fn get_knight_type() -> u8 { KNIGHT_TYPE }
    fn get_barbarian_type() -> u8 { BARBARIAN_TYPE }
    fn get_bowman_type() -> u8 { BOWMAN_TYPE }
    fn get_wizard_type() -> u8 { WIZARD_TYPE }
    fn is_dead(self: Character) -> bool {
        self.health == 0
    }
    fn take_damage(ref self: Character, hitter: u8, damage: u8) {
        let real_damage = if damage > self.health { self.health } else { damage };
        self.hitter = hitter;
        self.hit = real_damage;
        self.health -= real_damage;
    }
    fn reset_damage(ref self: Character) {
        self.hitter = 0;
        self.hit = 0;
    }
}


#[cfg(test)]
mod tests {
    use array::ArrayTrait;
    use super::{Character, CharacterTrait};
    use debug::PrintTrait;

    #[test]
    #[available_gas(1_000_000)]
    fn test_char_is_dead() {
        let char = CharacterTrait::new(0);
        assert(char.is_dead(), 'wrong death status');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_char_is_not_dead() {
        let char = CharacterTrait::new(0);
        assert(char.is_dead(), 'wrong death status');
    }
}