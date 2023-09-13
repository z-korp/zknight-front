use array::ArrayTrait;
use traits::Into;
use dict::Felt252DictTrait;
use nullable::NullableTrait;
use debug::PrintTrait;

use zknight::components::tile::{Tile, TileTrait};
use zknight::components::map::{_compose, _decompose};
use zknight::entities::foe::FoeTrait;

#[derive(Copy, Drop)]
struct Barbarian {
    health: u8,
}

impl BarbarianImpl of FoeTrait<Barbarian> {
    #[inline(always)]
    fn new(health: u8, _type: u8) -> Barbarian {
        Barbarian { health: health }
    }

    #[inline(always)]
    fn can_attack(self: Barbarian, tile: Tile, target: Tile) -> bool {
        tile.distance(target) == 1 && self.health > 0
    }

    #[inline(always)]
    fn can_move(self: Barbarian) -> bool {
        self.health > 0
    }

    #[inline(always)]
    fn compute_score(self: Barbarian, tile: Tile, target: Tile) -> u32 {
        tile.distance(target)
    }

    #[inline(always)]
    fn get_hits(self: Barbarian, tile: Tile, target: Tile, size: u32) -> Span<u32> {
        let mut hits: Array<u32> = array![];
        if !self.can_attack(tile, target) {
            return hits.span();
        };
        hits.append(target.index.into());
        hits.span()
    }

    #[inline(always)]
    fn next(
        self: Barbarian, tile: Tile, target: Tile, size: u32, ref tiles: Felt252Dict<Nullable<Tile>>
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
    use super::{Barbarian, FoeTrait};
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
    fn test_barbarian_compute_score_close() {
        let mut tiles = setup();
        let char = CharacterTrait::new(0);
        let barbarian: Barbarian = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 2, _type: 0, x: 3, y: 2 };
        let target = TileTrait::new(2, 1);
        let result = barbarian.next(tile, target, SIZE, ref tiles);
        let expected = 2 + SIZE * 2;
        assert(result == expected, 'Wrong result');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_barbarian_compute_score_near() {
        let mut tiles = setup();
        let char = CharacterTrait::new(0);
        let barbarian: Barbarian = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 2, _type: 0, x: 3, y: 2 };
        let target = TileTrait::new(1, 1);
        let result = barbarian.next(tile, target, SIZE, ref tiles);
        let expected = 2 + SIZE * 2;
        assert(result == expected, 'Wrong result');
    }

    #[test]
    #[available_gas(1_000_000)]
    fn test_barbarian_get_hits() {
        let mut tiles = setup();
        let char = CharacterTrait::new(1);
        let barbarian: Barbarian = FoeTrait::new(char.health, char._type);
        let tile = Tile { game_id: 0, level: 0, index: 3 + SIZE * 2, _type: 0, x: 3, y: 2 };
        let target = Tile { game_id: 0, level: 0, index: 3 + SIZE * 1, _type: 0, x: 3, y: 1 };
        let hits = barbarian.get_hits(tile, target, SIZE);
        let expected = 3 + SIZE * 1;
        assert(*hits.at(0) == expected, 'Wrong result');
    }
}
