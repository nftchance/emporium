//SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import {ERC20} from 'solady/src/tokens/ERC20.sol';

import {CaveatEnforcer} from '../abstracts/CaveatEnforcer.sol';
import {BytesLib} from '../libraries/BytesLib.sol';

contract ERC20AllowanceEnforcer is CaveatEnforcer {
	using BytesLib for bytes;

	/// @dev Function signature of the ERC20 `transfer` method.
	///      | transfer | a9059cbb | transfer(address,uint256) |
	bytes4 public constant ERC20_TRANSFER_FROM =
		bytes4(keccak256('transfer(address,uint256)'));

	/// @dev Balance of amount spend per permission hash.
	mapping(address => mapping(bytes32 => uint256)) spentMap;

	/**
	 * See {CaveatEnforcer-enforceCaveat}.
	 */
	function enforceCaveat(
		bytes calldata $terms,
		Transaction calldata $transaction,
		bytes32 $permissionHash
	) public override returns (bool) {
		/// @dev Determine the function being called by the transaction.
		bytes4 targetSig = bytes4($transaction.data[0:4]);

		/// @dev Ensure the method being called is `transferFrom`.
		require(
			targetSig == ERC20_TRANSFER_FROM,
			'ERC20AllowanceEnforcer:invalid-method'
		);

		/// @dev Retrieve the limit set by the Delegator.
		uint256 limit = decode($terms);
		/// @dev Retrieve the amount of tokens being transferred and starts
		///      at the 36th byte of the transaction data because the first
		///      4 bytes are the function signature and the next 32 bytes are
		///      the address of the token being transferred.
		uint256 sending = BytesLib.toUint256($transaction.data, 36);

		/// @dev Adjust the spent amount for the permission hash.
		spentMap[msg.sender][$permissionHash] += sending;

		/// @dev Retrieve the balance of the Delegator.
		uint256 spent = spentMap[msg.sender][$permissionHash];

		/// @dev Make sure amount spent will not exceed the limit.
		require(spent <= limit, 'ERC20AllowanceEnforcer:allowance-exceeded');

		return true;
	}

	/**
	 * @dev Decode the limit defined by the terms at a given bytes index.
	 */
	function decode(
		bytes calldata $terms
	) public pure returns (uint256 $limit) {
		/// @dev Decode the limit.
		$limit = BytesLib.toUint256($terms, 0);
	}

	/**
	 * @dev  Encode the limit into the terms of the Caveat.
	 */
	function encode(uint256 $limit) public pure returns (bytes memory $terms) {
		/// @dev Encode the limit.
		$terms = abi.encodePacked($limit);
	}
}
