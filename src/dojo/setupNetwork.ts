import { Query, RPCProvider } from '@dojoengine/core';
import { GraphQLClient } from 'graphql-request';
import { Account, AllowArray, Call } from 'starknet';
import { getSdk } from '../generated/graphql';
import { defineContractComponents } from './contractComponents';
import manifest from './manifest.json';
import { world } from './world';

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {
  // Extract environment variables for better readability.
  const { VITE_PUBLIC_WORLD_ADDRESS, VITE_PUBLIC_NODE_URL, VITE_PUBLIC_TORII } = import.meta.env;

  // Create a new RPCProvider instance.
  const provider = new RPCProvider(VITE_PUBLIC_WORLD_ADDRESS, manifest, VITE_PUBLIC_NODE_URL);

  // Utility function to get the SDK.
  const createGraphSdk = () => getSdk(new GraphQLClient(VITE_PUBLIC_TORII));

  // Return the setup object.
  return {
    provider,
    world,

    // Define contract components for the world.
    contractComponents: defineContractComponents(world),

    // Define the graph SDK instance.
    graphSdk: createGraphSdk(),

    // Execute function.
    execute: async (signer: Account, calls: AllowArray<Call>) => {
      const formattedCalls = Array.isArray(calls) ? calls : [calls];

      return provider.executeMulti(signer, formattedCalls);
    },

    // Entity query function.
    entity: async (component: string, query: Query) => {
      return provider.entity(component, query);
    },

    // Entities query function.
    entities: async (component: string, partition: number) => {
      return provider.entities(component, partition);
    },
  };
}
