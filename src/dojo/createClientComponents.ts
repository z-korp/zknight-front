import { overridableComponent } from '@latticexyz/recs';
import { SetupNetworkResult } from './setupNetwork';

export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents }: SetupNetworkResult) {
  return {
    ...contractComponents,
    Game: overridableComponent(contractComponents.Game),
    Map: overridableComponent(contractComponents.Map),
    Tile: overridableComponent(contractComponents.Tile),
    Character: overridableComponent(contractComponents.Character),
  };
}
