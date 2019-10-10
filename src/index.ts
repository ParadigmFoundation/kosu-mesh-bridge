import { WSClient } from "@0x/mesh-rpc-client";
import { Kosu } from "@kosu/kosu.js";
import HDWalletProvider from "truffle-hdwallet-provider";
import Web3 from "web3";

import arguments from "./arguments.json";

const {
    KOSU_JSONRPC_URL,
    ETHEREUM_JSONRPC_URL,
    MNEMONIC,

    ACCOUNT_INDEX = "0",
    MESH_JSONRPC_URL = "ws://localhost:60557",
} = process.env;

(async () => {
    const provider = new HDWalletProvider(MNEMONIC, ETHEREUM_JSONRPC_URL, parseInt(ACCOUNT_INDEX, 10));
    const web3 = new Web3(provider);
    const mesh = new WSClient(MESH_JSONRPC_URL);
    const kosu = new Kosu({ provider: web3.currentProvider, kosuNodeUrl: KOSU_JSONRPC_URL });

    const posterAddress = await web3.eth.getCoinbase();
    console.log(`using address: ${posterAddress}`);

    const _ = await mesh.subscribeToOrdersAsync(async orderEvents => {
        const kosuOrders = [];
        for (const event of orderEvents) {
            if (event.endState !== "ADDED") {
                return;
            }

            const { signedOrder } = event;
            const kosuOrder = {
                maker: signedOrder.makerAddress,
                subContract: signedOrder.exchangeAddress,
                arguments,
                makerValues: signedOrder,
            };

            const signed = await kosu.orderHelper.prepareForPost(kosuOrder, posterAddress);
            kosuOrders.push(signed);
        }

        const resp = await kosu.node.addOrders(kosuOrders);
        console.log("Response: %o", resp);
    });
})().catch(error => {
    console.log(`main failed with: ${error.message}`);
});
