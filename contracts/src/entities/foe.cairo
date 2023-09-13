use traits::Into;
use dict::Felt252DictTrait;
use nullable::NullableTrait;

use zknight::constants::{BARBARIAN_TYPE, BOWMAN_TYPE, WIZARD_TYPE};
use zknight::components::tile::{Tile, TileTrait};
use zknight::components::map::{_compose, _decompose};
use zknight::entities::barbarian::Barbarian;
use zknight::entities::bowman::Bowman;
use zknight::entities::wizard::Wizard;

#[derive(Copy, Drop)]
struct Foe {
    health: u8,
    _type: u8,
}

trait FoeTrait<T> {
    fn new(health: u8, _type: u8) -> T;
    fn can_attack(self: T, tile: Tile, target: Tile) -> bool;
    fn can_move(self: T) -> bool;
    fn compute_score(self: T, tile: Tile, target: Tile) -> u32;
    fn get_hits(self: T, tile: Tile, target: Tile, size: u32) -> Span<u32>;
    fn next(
        self: T, tile: Tile, target: Tile, size: u32, ref tiles: Felt252Dict<Nullable<Tile>>
    ) -> u32;
}

impl FoeImpl of FoeTrait<Foe> {
    fn new(health: u8, _type: u8) -> Foe {
        Foe { health: health, _type: _type }
    }

    fn can_attack(self: Foe, tile: Tile, target: Tile) -> bool {
        if self._type == BARBARIAN_TYPE {
            let barbarian = Barbarian { health: self.health };
            return barbarian.can_attack(tile, target);
        }
        if self._type == BOWMAN_TYPE {
            let bowman = Bowman { health: self.health };
            return bowman.can_attack(tile, target);
        }
        let wizard = Wizard { health: self.health };
        wizard.can_attack(tile, target)
    }

    fn can_move(self: Foe) -> bool {
        if self._type == BARBARIAN_TYPE {
            let barbarian = Barbarian { health: self.health };
            return barbarian.can_move();
        }
        if self._type == BOWMAN_TYPE {
            let bowman = Bowman { health: self.health };
            return bowman.can_move();
        }
        let wizard = Wizard { health: self.health };
        wizard.can_move()
    }

    fn compute_score(self: Foe, tile: Tile, target: Tile) -> u32 {
        if self._type == BARBARIAN_TYPE {
            let barbarian = Barbarian { health: self.health };
            return barbarian.compute_score(tile, target);
        }
        if self._type == BOWMAN_TYPE {
            let bowman = Bowman { health: self.health };
            return bowman.compute_score(tile, target);
        }
        let wizard = Wizard { health: self.health };
        wizard.compute_score(tile, target)
    }

    fn get_hits(self: Foe, tile: Tile, target: Tile, size: u32) -> Span<u32> {
        if self._type == BARBARIAN_TYPE {
            let barbarian = Barbarian { health: self.health };
            return barbarian.get_hits(tile, target, size);
        }
        if self._type == BOWMAN_TYPE {
            let bowman = Bowman { health: self.health };
            return bowman.get_hits(tile, target, size);
        }
        let wizard = Wizard { health: self.health };
        wizard.get_hits(tile, target, size)
    }

    fn next(
        self: Foe, tile: Tile, target: Tile, size: u32, ref tiles: Felt252Dict<Nullable<Tile>>
    ) -> u32 {
        if self._type == BARBARIAN_TYPE {
            let barbarian = Barbarian { health: self.health };
            return barbarian.next(tile, target, size, ref tiles);
        }
        if self._type == BOWMAN_TYPE {
            let bowman = Bowman { health: self.health };
            return bowman.next(tile, target, size, ref tiles);
        }
        let wizard = Wizard { health: self.health };
        wizard.next(tile, target, size, ref tiles)
    }
}

