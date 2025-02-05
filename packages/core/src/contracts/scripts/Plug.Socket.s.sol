/// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import { Script } from "forge-std/Script.sol";
import { Plug } from "../base/Plug.sol";
import { PlugEtcherLib } from "../libraries/Plug.Etcher.Lib.sol";

/**
 * This is the script used to deploy the entire Plug protocol stack at once. Each time upon
 * build the active contracts are automatically populated so that you never have to deal
 * with manual coordination of your contracts or updating the deployment scripts.
 */
contract PlugSocketDeployment is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        if (PlugEtcherLib.PLUG_SOCKET_ADDRESS.code.length == 0) {
            PlugEtcherLib.FACTORY.safeCreate2(
                PlugEtcherLib.PLUG_SOCKET_SALT, PlugEtcherLib.PLUG_SOCKET_INITCODE
            );
        }

        vm.stopBroadcast();
    }
}
