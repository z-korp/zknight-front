mod constants;

mod entities {
    mod foe;
    mod barbarian;
    mod bowman;
    mod wizard;
}

mod components {
    mod game;
    mod map;
    mod tile;
    mod character;
}

mod systems {
    mod create;
    mod play;
    mod spawn;
}

#[cfg(test)]
mod tests {
    mod setup;
    mod play;
}
