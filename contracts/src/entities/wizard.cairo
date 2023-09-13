use array::ArrayTrait;
use traits::Into;
use dict::Felt252DictTrait;
use nullable::NullableTrait;

use zknight::components::tile::{Tile, TileTrait};
use zknight::components::map::{_compose, _decompose};
use zknight::entities::foe::FoeTrait;

#[derive(Copy, Drop)]
struct Wizard {
    health: u8,
}

impl WizardImpl of FoeTrait<Wizard> {
    #[inline(always)]
    fn new(health: u8, _type: u8) -> Wizard {
        Wizard { health: health }
    }

    #[inline(always)]
    fn can_attack(self: Wizard, tile: Tile, target: Tile) -> bool {
        let distance = tile.distance(target);
        self.health > 0 && distance <= 25 && (tile.x == target.x || tile.y == target.y)
    }

    #[inline(always)]
    fn can_move(self: Wizard) -> bool {
        self.health > 0
    }

    #[inline(always)]
    fn compute_score(self: Wizard, tile: Tile, target: Tile) -> u32 {
        let distance = tile.distance(target);
        if distance <= 25 && (tile.x == target.x || tile.y == target.y) {
            return 0;
        }
        if distance > 30 {
            return distance + 1;
        }
        let dx = if tile.x > target.x {
            tile.x - target.x
        } else {
            target.x - tile.x
        };
        let dy = if tile.y > target.y {
            tile.y - target.y
        } else {
            target.y - tile.y
        };
        let min = if dx > dy {
            dy
        } else {
            dx
        };
        min
    }

    fn get_hits(self: Wizard, tile: Tile, target: Tile, size: u32) -> Span<u32> {
        let mut hits: Array<u32> = array![];
        if !self.can_attack(tile, target) {
            return hits.span();
        };

        if target.x > tile.x {
            let max_x = tile.x + 5;
            let mut i = 1;
            loop {
                let x = tile.x + i;
                if x >= size || x > max_x {
                    break;
                }
                hits.append(x + tile.y * size);
                i += 1;
            };
        } else if target.x < tile.x {
            let min_x = if tile.x > 5 {
                tile.x - 5
            } else {
                0
            };
            let mut i = 1;
            loop {
                if i > tile.x || tile.x < min_x + i {
                    break;
                }
                let x = tile.x - i;
                hits.append(x + tile.y * size);
                i += 1;
            };
        } else if target.y > tile.y {
            let max_y = tile.y + 5;
            let mut i = 1;
            loop {
                let y = tile.y + i;
                if y >= size || y > max_y {
                    break;
                }
                hits.append(tile.x + y * size);
                i += 1;
            };
        } else if target.y < tile.y {
            let min_y = if tile.y > 5 {
                tile.y - 5
            } else {
                0
            };
            let mut i = 1;
            loop {
                if i > tile.y || tile.y < min_y + i {
                    break;
                }
                let y = tile.y - i;
                hits.append(tile.x + y * size);
                i += 1;
            };
        }
        hits.span()
    }

    #[inline(always)]
    fn next(
        self: Wizard, tile: Tile, target: Tile, size: u32, ref tiles: Felt252Dict<Nullable<Tile>>
    ) -> u32 {
        // [Compute] Current tile score
        let mut result = tile;
        let mut score = self.compute_score(tile, target);

        // [Compute] Left neighbors scores
        if tile.x > 0 {
            let index: felt252 = _compose(tile.x - 1, tile.y, size).into();
            let new_tile = tiles.get(index).deref();
            if new_tile.is_ground() {
                let new_score = self.compute_score(new_tile, target);
                if new_score < score {
                    score = new_score;
                    result = new_tile;
                };
            };
        };

        // [Compute] Right neighbors scores
        if tile.x < size - 1 {
            let index: felt252 = _compose(tile.x + 1, tile.y, size).into();
            let new_tile = tiles.get(index).deref();
            if new_tile.is_ground() {
                let new_score = self.compute_score(new_tile, target);
                if new_score < score {
                    score = new_score;
                    result = new_tile;
                };
            };
        };

        // [Compute] Up neighbor scores
        if tile.y > 0 {
            let index: felt252 = _compose(tile.x, tile.y - 1, size).into();
            let new_tile = tiles.get(index).deref();
            if new_tile.is_ground() {
                let new_score = self.compute_score(new_tile, target);
                if new_score < score {
                    score = new_score;
                    result = new_tile;
                };
            };
        };

        // [Compute] Down neighbor scores
        if tile.y < size - 1 {
            let index: felt252 = _compose(tile.x, tile.y + 1, size).into();
            let new_tile = tiles.get(index).deref();
            if new_tile.is_ground() {
                let new_score = self.compute_score(new_tile, target);
                if new_score < score {
                    score = new_score;
                    result = new_tile;
                };
            };
        };

        result.index
    }
}

#[cfg(test)]
mod tests {
    use traits::Into;
    use array::{ArrayTrait, SpanTrait};
    use dict::Felt252DictTrait;
    use nullable::NullableTrait;
    use zknight::components::character::{Character, CharacterTrait};
    use zknight::components::tile::{Tile, TileTrait};
    use super::{Wizard, FoeTrait};
    use debug::PrintTrait;

    const SIZE: u32 = 8;

    fn setup() -> Felt252Dict<Nullable<Tile>> {
        let mut tiles: Felt252Dict<Nullable<Tile>> = Default::default();
        let tile = Tile { game_id: 0, level: 0, index: 2 + SIZE * 1, _type: 0, x: 2, y: 1 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 1, _type: 0, x: 3, y: 1 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        let tile = Tile { game_id: 0, level: 0, index: 4 + SIZE * 1, _type: 0, x: 4, y: 1 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        let tile = Tile { game_id: 0, level: 0, index: 2 + SIZE * 2, _type: 0, x: 2, y: 2 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 2, _type: 0, x: 3, y: 2 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        let tile = Tile { game_id: 0, level: 0, index: 4 + SIZE * 2, _type: 0, x: 4, y: 2 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        let tile = Tile { game_id: 0, level: 0, index: 2 + SIZE * 3, _type: 0, x: 2, y: 3 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 3, _type: 0, x: 3, y: 3 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        let tile = Tile { game_id: 0, level: 0, index: 4 + SIZE * 3, _type: 0, x: 4, y: 3 };
        tiles.insert(tile.index.into(), nullable_from_box(BoxTrait::new(tile)));
        tiles
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_wizard_compute_score_close() {
        let mut tiles = setup();
        let char = CharacterTrait::new(0);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 2, _type: 0, x: 3, y: 2 };
        let target = TileTrait::new(2, 1);
        let result = wizard.next(tile, target, SIZE, ref tiles);
        let expected = 2 + SIZE * 2;
        assert(result == expected, 'Wrong result');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_wizard_compute_score_near() {
        let mut tiles = setup();
        let char = CharacterTrait::new(0);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 2, _type: 0, x: 3, y: 2 };
        let target = TileTrait::new(1, 1);
        let result = wizard.next(tile, target, SIZE, ref tiles);
        let expected = 3 + SIZE * 1;
        assert(result == expected, 'Wrong result');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_bowman_get_hits_top_break() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 2, _type: 0, x: 3, y: 2 };
        let target = Tile { game_id: 0, level: 0, index: 1 + SIZE * 2, _type: 0, x: 1, y: 2 };
        let hits = wizard.get_hits(tile, target, SIZE);
        let expected = array![2 + SIZE * 2, 1 + SIZE * 2, 0 + SIZE * 2].span();
        assert(hits.len() == expected.len(), 'Wrong result len');
        assert(hits.at(0) == expected.at(0), 'Wrong result at 0');
        assert(hits.at(1) == expected.at(1), 'Wrong result at 1');
        assert(hits.at(2) == expected.at(2), 'Wrong result at 2');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_bowman_get_hits_top() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 7 + SIZE * 2, _type: 0, x: 7, y: 2 };
        let target = Tile { game_id: 0, level: 0, index: 4 + SIZE * 2, _type: 0, x: 4, y: 2 };
        let hits = wizard.get_hits(tile, target, SIZE);
        let expected = array![6 + SIZE * 2, 5 + SIZE * 2, 4 + SIZE * 2, 3 + SIZE * 2, 2 + SIZE * 2]
            .span();
        assert(hits.len() == expected.len(), 'Wrong result len');
        assert(hits.at(0) == expected.at(0), 'Wrong result at 0');
        assert(hits.at(1) == expected.at(1), 'Wrong result at 1');
        assert(hits.at(2) == expected.at(2), 'Wrong result at 2');
        assert(hits.at(3) == expected.at(3), 'Wrong result at 3');
        assert(hits.at(4) == expected.at(4), 'Wrong result at 4');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_bowman_get_hits_bottom() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 1 + SIZE * 2, _type: 0, x: 1, y: 2 };
        let target = Tile { game_id: 0, level: 0, index: 3 + SIZE * 2, _type: 0, x: 3, y: 2 };
        let hits = wizard.get_hits(tile, target, SIZE);
        let expected = array![2 + SIZE * 2, 3 + SIZE * 2, 4 + SIZE * 2, 5 + SIZE * 2, 6 + SIZE * 2]
            .span();
        assert(hits.len() == expected.len(), 'Wrong result len');
        assert(hits.at(0) == expected.at(0), 'Wrong result at 0');
        assert(hits.at(1) == expected.at(1), 'Wrong result at 1');
        assert(hits.at(2) == expected.at(2), 'Wrong result at 2');
        assert(hits.at(3) == expected.at(3), 'Wrong result at 3');
        assert(hits.at(4) == expected.at(4), 'Wrong result at 4');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_bowman_get_hits_bottom_break() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 4 + SIZE * 2, _type: 0, x: 4, y: 2 };
        let target = Tile { game_id: 0, level: 0, index: 7 + SIZE * 2, _type: 0, x: 7, y: 2 };
        let hits = wizard.get_hits(tile, target, SIZE);
        let expected = array![5 + SIZE * 2, 6 + SIZE * 2, 7 + SIZE * 2].span();
        assert(hits.len() == expected.len(), 'Wrong result len');
        assert(hits.at(0) == expected.at(0), 'Wrong result at 0');
        assert(hits.at(1) == expected.at(1), 'Wrong result at 1');
        assert(hits.at(2) == expected.at(2), 'Wrong result at 2');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_bowman_get_hits_left() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 1 + SIZE * 1, _type: 0, x: 1, y: 1 };
        let target = Tile { game_id: 0, level: 0, index: 1 + SIZE * 3, _type: 0, x: 1, y: 3 };
        let hits = wizard.get_hits(tile, target, SIZE);
        let expected = array![1 + SIZE * 2, 1 + SIZE * 3, 1 + SIZE * 4, 1 + SIZE * 5, 1 + SIZE * 6]
            .span();
        assert(hits.len() == expected.len(), 'Wrong result len');
        assert(hits.at(0) == expected.at(0), 'Wrong result at 0');
        assert(hits.at(1) == expected.at(1), 'Wrong result at 1');
        assert(hits.at(2) == expected.at(2), 'Wrong result at 2');
        assert(hits.at(3) == expected.at(3), 'Wrong result at 3');
        assert(hits.at(4) == expected.at(4), 'Wrong result at 4');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_bowman_get_hits_left_break() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 1 + SIZE * 5, _type: 0, x: 1, y: 5 };
        let target = Tile { game_id: 0, level: 0, index: 1 + SIZE * 7, _type: 0, x: 1, y: 7 };
        let hits = wizard.get_hits(tile, target, SIZE);
        let expected = array![1 + SIZE * 6, 1 + SIZE * 7].span();
        assert(hits.len() == expected.len(), 'Wrong result len');
        assert(hits.at(0) == expected.at(0), 'Wrong result at 0');
        assert(hits.at(1) == expected.at(1), 'Wrong result at 1');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_bowman_get_hits_right_break() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 1 + SIZE * 3, _type: 0, x: 1, y: 3 };
        let target = Tile { game_id: 0, level: 0, index: 1 + SIZE * 1, _type: 0, x: 1, y: 1 };
        let hits = wizard.get_hits(tile, target, SIZE);
        let expected = array![1 + SIZE * 2, 1 + SIZE * 1, 1 + SIZE * 0].span();
        assert(hits.len() == expected.len(), 'Wrong result len');
        assert(hits.at(0) == expected.at(0), 'Wrong result at 0');
        assert(hits.at(1) == expected.at(1), 'Wrong result at 1');
        assert(hits.at(2) == expected.at(2), 'Wrong result at 2');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_bowman_get_hits_right() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let wizard: Wizard = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 1 + SIZE * 7, _type: 0, x: 1, y: 7 };
        let target = Tile { game_id: 0, level: 0, index: 1 + SIZE * 5, _type: 0, x: 1, y: 5 };
        let hits = wizard.get_hits(tile, target, SIZE);
        let expected = array![1 + SIZE * 6, 1 + SIZE * 5, 1 + SIZE * 4, 1 + SIZE * 3, 1 + SIZE * 2]
            .span();
        assert(hits.len() == expected.len(), 'Wrong result len');
        assert(hits.at(0) == expected.at(0), 'Wrong result at 0');
        assert(hits.at(1) == expected.at(1), 'Wrong result at 1');
        assert(hits.at(2) == expected.at(2), 'Wrong result at 2');
        assert(hits.at(3) == expected.at(3), 'Wrong result at 3');
        assert(hits.at(4) == expected.at(4), 'Wrong result at 4');
    }
}
