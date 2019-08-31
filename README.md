# Tool: `kosu-mesh-bridge`

Experimental "bridge" for liquidity between the [0x-mesh](https://github.com/0x-project/0x-mesh) network, and the Kosu network.

Initially, it just pulls orders from Mesh and posts them to Kosu with an authenticated account (an account with non-zero bonded Kosu tokens).

## Usage

To start the bridge, fill in the necessary environment variables in `docker-compose.yaml`, and run the following:

```bash
# wraps `docker-compose up --build`
yarn up
```

To stop the cluster (the 0x mesh node, and the bridge script):

```bash
yarn down
```

## Development

### Prerequisite

The account used to sign the Kosu orders must have an active bond submitted to the Kosu PosterRegistry.

You can do this programmatically with `kosu.js`, or at `https://portal.kosu.io`. 

### Configuration

Provide the following required configuration as environment variables to the script process.

```bash
# url of a remote or local kosu node serving JSONRPC/ws
KOSU_JSONRPC_URL=

# url of a remote or local eth node serving JSONRPC
ETHEREUM_JSONRPC_URL=

# url of a remote or local mesh node serving JSONRPC
MESH_JSONRPC_URL=

# mnemonic of a **ROPSTEN** account with active kosu poster bond
MNEMONIC=

# uses default derivation path, with optional account index
ACCOUNT_INDEX=
```

### Build and run

Start the script directly (and configure the Mesh node separately) with the following:

```bash
# install dependencies
yarn

# build the typescript project
yarn build

# start the script
yarn start
```