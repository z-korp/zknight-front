use array::{SpanTrait, ArrayTrait};

use zknight::constants::{GROUND_TYPE, HOLE_TYPE, KNIGHT_TYPE, BARBARIAN_TYPE, BOWMAN_TYPE, WIZARD_TYPE};

#[derive(Component, Copy, Drop, Serde, SerdeLen, Felt252Dict)]
struct Tile {
    #[key]
    game_id: u32,
    #[key]
    level: u32,
    #[key]
    index: u32,
    _type: u8,
    x: u32,
    y: u32,
}

trait TileTrait {
    fn new(x: u32, y: u32) -> Tile;
    fn is_ground(self: Tile) -> bool;
    fn is_hole(self: Tile) -> bool;
    fn is_knight(self: Tile) -> bool;
    fn is_barbarian(self: Tile) -> bool;
    fn is_bowman(self: Tile) -> bool;
    fn is_wizard(self: Tile) -> bool;
    fn is_character(self: Tile) -> bool;
    fn is_zero(self: Tile) -> bool;
    fn is_equal(self: Tile, b: Tile) -> bool;
    fn is_close(self: Tile, b: Tile) -> bool;
    fn distance(self: Tile, b: Tile) -> u32;
    fn is_include(self: Tile, tiles: Span<Tile>) -> bool;
    fn set_ground_type(ref self: Tile);
    fn set_knight_type(ref self: Tile);
    fn set_barbarian_type(ref self: Tile);
    fn set_bowman_type(ref self: Tile);
    fn set_wizard_type(ref self: Tile);
}

impl TileImpl of TileTrait {
    fn new(x: u32, y: u32) -> Tile {
        Tile { game_id: 0, level: 0, index: 0, _type: 0, x, y }
    }

    fn is_ground(self: Tile) -> bool {
        self._type == GROUND_TYPE
    }

    fn is_hole(self: Tile) -> bool {
        self._type == HOLE_TYPE
    }

    fn is_knight(self: Tile) -> bool {
        self._type == KNIGHT_TYPE
    }

    fn is_barbarian(self: Tile) -> bool {
        self._type == BARBARIAN_TYPE
    }

    fn is_bowman(self: Tile) -> bool {
        self._type == BOWMAN_TYPE
    }

    fn is_wizard(self: Tile) -> bool {
        self._type == WIZARD_TYPE
    }

    fn is_character(self: Tile) -> bool {
        !self.is_hole() && !self.is_ground()
    }

    fn is_zero(self: Tile) -> bool {
        self.x - self.y == 0
    }

    fn is_equal(self: Tile, b: Tile) -> bool {
        self.x == b.x && self.y == b.y
    }

    fn is_close(self: Tile, b: Tile) -> bool {
        self.distance(b) <= 1
    }

    fn distance(self: Tile, b: Tile) -> u32 {
        let mut dx = 0;
        if self.x > b.x {
            dx = self.x - b.x;
        } else {
            dx = b.x - self.x;
        };

        let mut dy = 0;
        if self.y > b.y {
            dy = self.y - b.y;
        } else {
            dy = b.y - self.y;
        };
        dx * dx + dy * dy
    }

    fn is_include(self: Tile, tiles: Span<Tile>) -> bool {
        let mut length = tiles.len();
        loop {
            if length == 0 {
                break false;
            }
            length -= 1;
            if !self.is_equal(*tiles[length]) {
                continue;
            }
            break true;
        }
    }

    fn set_ground_type(ref self: Tile) {
        self._type = GROUND_TYPE;
    }

    fn set_knight_type(ref self: Tile) {
        self._type = KNIGHT_TYPE;
    }

    fn set_barbarian_type(ref self: Tile) {
        self._type = BARBARIAN_TYPE;
    }

    fn set_bowman_type(ref self: Tile) {
        self._type = BOWMAN_TYPE;
    }

    fn set_wizard_type(ref self: Tile) {
        self._type = WIZARD_TYPE;
    }
}

#[cfg(test)]
mod tests {
    use array::{SpanTrait, ArrayTrait};
    use super::{Tile, TileTrait};
    use debug::PrintTrait;

    #[test]
    #[available_gas(100_000)]
    fn test_tile_new() {
        let expected = Tile { game_id: 0, level: 0, index: 0, _type: 0, x: 1, y: 1 };
        let tile = TileTrait::new(1, 1);
        assert(tile.is_equal(expected), 'new failed');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_is_zero() {
        assert(TileTrait::is_zero(TileTrait::new(0, 0)), 'not zero');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_is_equal() {
        let tile = TileTrait::new(420, 0);
        assert(TileTrait::is_equal(tile, TileTrait::new(420, 0)), 'not equal');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_distance() {
        let tile = TileTrait::new(1, 1);
        assert(TileTrait::distance(tile, TileTrait::new(2, 2)) == 2, 'wrong distance');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_is_close() {
        let tile = TileTrait::new(1, 1);
        assert(TileTrait::is_close(tile, TileTrait::new(2, 1)), 'wrong close status');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_is_not_close() {
        let tile = TileTrait::new(0, 0);
        assert(!TileTrait::is_close(tile, TileTrait::new(2, 2)), 'wrong close status');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_is_include() {
        let tile = TileTrait::new(0, 0);
        let mut tiles: Array<Tile> = array![];
        tiles.append(TileTrait::new(1, 1));
        tiles.append(TileTrait::new(0, 0));
        assert(TileTrait::is_include(tile, tiles.span()), 'wrong include status');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_is_not_include() {
        let tile = TileTrait::new(0, 0);
        let mut tiles: Array<Tile> = array![];
        tiles.append(TileTrait::new(1, 1));
        tiles.append(TileTrait::new(1, 0));
        assert(!TileTrait::is_include(tile, tiles.span()), 'wrong include status');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_set_knight_type() {
        let mut tile = TileTrait::new(0, 0);
        tile.set_knight_type();
        assert(tile.is_knight(), 'wrong type');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_set_barbarian_type() {
        let mut tile = TileTrait::new(0, 0);
        tile.set_barbarian_type();
        assert(tile.is_barbarian(), 'wrong type');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_set_bowman_type() {
        let mut tile = TileTrait::new(0, 0);
        tile.set_bowman_type();
        assert(tile.is_bowman(), 'wrong type');
    }

    #[test]
    #[available_gas(100_000)]
    fn test_tile_set_wizard_type() {
        let mut tile = TileTrait::new(0, 0);
        tile.set_wizard_type();
        assert(tile.is_wizard(), 'wrong type');
    }
}
