import { SCALE_MODES, Texture } from 'pixi.js';

export enum Direction {
  S,
  SE,
  E,
  NE,
  N,
  NW,
  W,
  SW,
}

export enum Animation {
  Idle,
  Walk,
  Carry,
  Jump,
  SwordAttack,
  BowAttack,
  StaffAttack,
  Throw,
  Hurt,
  Death,
}

export const getFramesFromType = (
  mob_name: string,
  type: Animation,
  direction: Direction,
  resource: any
): Texture[] => {
  const frames = Object.keys(resource.data.frames);
  let filtered = [];
  if (type === Animation.Idle) {
    console.log('[', mob_name, ']', 'Idle Frame');
    filtered = frames.filter((e) => e.includes('idle'));
  } else if (type === Animation.Walk) {
    console.log('[', mob_name, ']', 'Walk Frame');
    filtered = frames.filter((e) => e.includes('walk'));
  } else if (type === Animation.Carry) {
    console.log('[', mob_name, ']', 'Carry Frame');
    filtered = frames.filter((e) => e.includes('carry'));
  } else if (type === Animation.Jump) {
    console.log('[', mob_name, ']', 'Jump Frame');
    filtered = frames.filter((e) => e.includes('jump'));
  } else if (type === Animation.SwordAttack) {
    console.log('[', mob_name, ']', 'SwordAttack Frame');
    filtered = frames.filter((e) => e.includes('sword'));
  } else if (type === Animation.BowAttack) {
    console.log('[', mob_name, ']', 'BowAttack Frame');
    filtered = frames.filter((e) => e.includes('-bow'));
  } else if (type === Animation.StaffAttack) {
    console.log('[', mob_name, ']', 'StaffAttack Frame');
    filtered = frames.filter((e) => e.includes('staff'));
  } else if (type === Animation.Throw) {
    console.log('[', mob_name, ']', 'Throw Frame');
    filtered = frames.filter((e) => e.includes('throw'));
  } else if (type === Animation.Hurt) {
    console.log('[', mob_name, ']', 'Hurt Frame');
    filtered = frames.filter((e) => e.includes('hurt'));
  } else if (type === Animation.Death) {
    console.log('[', mob_name, ']', 'Death Frame');
    filtered = frames.filter((e) => e.includes('death'));
  } else {
    throw new Error('Invalid AnimationType');
  }
  console.log('FILTERED', filtered);
  if (direction === Direction.SE) {
    filtered = filtered.filter((e) => /-SE-/.test(e));
  } else if (direction === Direction.SW) {
    filtered = filtered.filter((e) => /-SW-/.test(e));
  } else if (direction === Direction.NW) {
    filtered = filtered.filter((e) => /-NW-/.test(e));
  } else if (direction === Direction.NE) {
    filtered = filtered.filter((e) => /-NE-/.test(e));
  } else if (direction === Direction.S) {
    filtered = filtered.filter((e) => /-S-/.test(e) && !/-SE-/.test(e) && !/-SW-/.test(e));
  } else if (direction === Direction.E) {
    filtered = filtered.filter((e) => /-E-/.test(e) && !/-SE-/.test(e) && !/-NE-/.test(e));
  } else if (direction === Direction.N) {
    filtered = filtered.filter((e) => /-N-/.test(e) && !/-NE-/.test(e) && !/-NW-/.test(e));
  } else if (direction === Direction.W) {
    filtered = filtered.filter((e) => /-W-/.test(e) && !/-SW-/.test(e) && !/-NW-/.test(e));
  }

  console.log(filtered);

  return filtered.map((frame: any) => {
    const texture = Texture.from(frame);
    console.log(texture);
    texture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
    return texture;
  }) as Texture[];
};
