// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.19;

import {ECDSA} from 'solady/src/utils/ECDSA.sol';

/**
 * @title Framework:Types
 * @notice The base EIP-712 types that power a modern intent framework.
 * @dev This file was auto-generated by @nftchance/emporium-types/cli 
 *      and should not be edited directly otherwise the alchemy 
 *      will fail and you will have to pay with a piece of your soul.
 *      (https://github.com/nftchance/emporium-types)
 * @dev This interface and the consuming abstract are auto-generated by
 *      types declared in the framework configuration at (./config.ts). 
 *      As an extensible base, all projects build on top of Delegations 
 *      and Invocations.
 * @author @nftchance
 * @author @nftchance/emporium-types (2023-10-26)
 * @author @danfinlay (https://github.com/delegatable/delegatable-sol)
 * @author @KamesGeraghty (https://github.com/kamescg)
 */
interface ITypes {
	/**
     * @notice This struct is used to encode EIP712Domain data into a packet hash and
     *         decode EIP712Domain data from a packet hash.
     * 
     * EIP712Domain extends EIP712<{ 
     *    { name: 'name', type: 'string' }
	 *    { name: 'version', type: 'string' }
	 *    { name: 'chainId', type: 'uint256' }
	 *    { name: 'verifyingContract', type: 'address' }
     * }>
     */
    struct EIP712Domain {
		string name;
		string version;
		uint256 chainId;
		address verifyingContract;
	}

	/**
     * @notice This struct is used to encode Delegation data into a packet hash and
     *         decode Delegation data from a packet hash.
     * 
     * Delegation extends EIP712<{ 
     *    { name: 'delegate', type: 'address' }
	 *    { name: 'authority', type: 'bytes32' }
	 *    { name: 'caveats', type: 'Caveat[]' }
	 *    { name: 'salt', type: 'bytes32' }
     * }>
     */
    struct Delegation {
		address delegate;
		bytes32 authority;
		Caveat[] caveats;
		bytes32 salt;
	}

	/**
     * @notice This struct is used to encode Caveat data into a packet hash and
     *         decode Caveat data from a packet hash.
     * 
     * Caveat extends EIP712<{ 
     *    { name: 'enforcer', type: 'address' }
	 *    { name: 'terms', type: 'bytes' }
     * }>
     */
    struct Caveat {
		address enforcer;
		bytes terms;
	}

	/**
     * @notice This struct is used to encode Transaction data into a packet hash and
     *         decode Transaction data from a packet hash.
     * 
     * Transaction extends EIP712<{ 
     *    { name: 'to', type: 'address' }
	 *    { name: 'gasLimit', type: 'uint256' }
	 *    { name: 'data', type: 'bytes' }
     * }>
     */
    struct Transaction {
		address to;
		uint256 gasLimit;
		bytes data;
	}

	/**
     * @notice This struct is used to encode SignedDelegation data into a packet hash and
     *         decode SignedDelegation data from a packet hash.
     * 
     * SignedDelegation extends EIP712<{ 
     *    { name: 'delegation', type: 'Delegation' }
	 *    { name: 'signature', type: 'bytes' }
     * }>
     */
    struct SignedDelegation {
		Delegation delegation;
		bytes signature;
	}

	/**
     * @notice This struct is used to encode Invocation data into a packet hash and
     *         decode Invocation data from a packet hash.
     * 
     * Invocation extends EIP712<{ 
     *    { name: 'transaction', type: 'Transaction' }
	 *    { name: 'authority', type: 'SignedDelegation[]' }
     * }>
     */
    struct Invocation {
		Transaction transaction;
		SignedDelegation[] authority;
	}

	/**
     * @notice This struct is used to encode ReplayProtection data into a packet hash and
     *         decode ReplayProtection data from a packet hash.
     * 
     * ReplayProtection extends EIP712<{ 
     *    { name: 'nonce', type: 'uint256' }
	 *    { name: 'queue', type: 'uint256' }
     * }>
     */
    struct ReplayProtection {
		uint256 nonce;
		uint256 queue;
	}

	/**
     * @notice This struct is used to encode Invocations data into a packet hash and
     *         decode Invocations data from a packet hash.
     * 
     * Invocations extends EIP712<{ 
     *    { name: 'batch', type: 'Invocation[]' }
	 *    { name: 'replayProtection', type: 'ReplayProtection' }
     * }>
     */
    struct Invocations {
		Invocation[] batch;
		ReplayProtection replayProtection;
	}

	/**
     * @notice This struct is used to encode SignedInvocations data into a packet hash and
     *         decode SignedInvocations data from a packet hash.
     * 
     * SignedInvocations extends EIP712<{ 
     *    { name: 'invocations', type: 'Invocations' }
	 *    { name: 'signature', type: 'bytes' }
     * }>
     */
    struct SignedInvocations {
		Invocations invocations;
		bytes signature;
	}
}

/**
 * @title Framework:Types 
 * @dev This file was auto-generated by @nftchance/emporium-types/cli.
 *      (https://github.com/nftchance/emporium-types)
 * @dev This abstract contract is auto-generated and should not be edited directly
 *      however it should be directly inherited from in the consuming protocol
 *      to power the processing of generalized intents.
 * @author @nftchance
 * @author @nftchance/emporium-types (2023-10-26)
 * @author @danfinlay (https://github.com/delegatable/delegatable-sol)
 * @author @KamesGeraghty (https://github.com/kamescg)
 */
abstract contract Types is ITypes {
    /// @notice Use the ECDSA library for signature verification.
    using ECDSA for bytes32;

    /// @notice The hash of the domain separator used in the EIP712 domain hash.
    bytes32 public immutable domainHash;

	/**
     * @dev Type hash representing the EIP712Domain data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * EIP712_DOMAIN_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'name', type: 'string' }
	 *   { name: 'version', type: 'string' }
	 *   { name: 'chainId', type: 'uint256' }
	 *   { name: 'verifyingContract', type: 'address' } 
     * }>>
     */
    bytes32 constant EIP712_DOMAIN_TYPEHASH = keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)');

	/**
     * @dev Type hash representing the Delegation data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * DELEGATION_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'delegate', type: 'address' }
	 *   { name: 'authority', type: 'bytes32' }
	 *   { name: 'caveats', type: 'Caveat[]' }
	 *   { name: 'salt', type: 'bytes32' } 
     * }>>
     */
    bytes32 constant DELEGATION_TYPEHASH = keccak256('Delegation(address delegate,bytes32 authority,Caveat[] caveats,bytes32 salt)Caveat(address enforcer,bytes terms)');

	/**
     * @dev Type hash representing the Caveat data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * CAVEAT_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'enforcer', type: 'address' }
	 *   { name: 'terms', type: 'bytes' } 
     * }>>
     */
    bytes32 constant CAVEAT_TYPEHASH = keccak256('Caveat(address enforcer,bytes terms)');

	/**
     * @dev Type hash representing the Transaction data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * TRANSACTION_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'to', type: 'address' }
	 *   { name: 'gasLimit', type: 'uint256' }
	 *   { name: 'data', type: 'bytes' } 
     * }>>
     */
    bytes32 constant TRANSACTION_TYPEHASH = keccak256('Transaction(address to,uint256 gasLimit,bytes data)');

	/**
     * @dev Type hash representing the SignedDelegation data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * SIGNED_DELEGATION_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'delegation', type: 'Delegation' }
	 *   { name: 'signature', type: 'bytes' } 
     * }>>
     */
    bytes32 constant SIGNED_DELEGATION_TYPEHASH = keccak256('SignedDelegation(Delegation delegation,bytes signature)Caveat(address enforcer,bytes terms)Delegation(address delegate,bytes32 authority,Caveat[] caveats,bytes32 salt)');

	/**
     * @dev Type hash representing the Invocation data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * INVOCATION_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'transaction', type: 'Transaction' }
	 *   { name: 'authority', type: 'SignedDelegation[]' } 
     * }>>
     */
    bytes32 constant INVOCATION_TYPEHASH = keccak256('Invocation(Transaction transaction,SignedDelegation[] authority)Caveat(address enforcer,bytes terms)Delegation(address delegate,bytes32 authority,Caveat[] caveats,bytes32 salt)SignedDelegation(Delegation delegation,bytes signature)Transaction(address to,uint256 gasLimit,bytes data)');

	/**
     * @dev Type hash representing the ReplayProtection data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * REPLAY_PROTECTION_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'nonce', type: 'uint256' }
	 *   { name: 'queue', type: 'uint256' } 
     * }>>
     */
    bytes32 constant REPLAY_PROTECTION_TYPEHASH = keccak256('ReplayProtection(uint256 nonce,uint256 queue)');

	/**
     * @dev Type hash representing the Invocations data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * INVOCATIONS_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'batch', type: 'Invocation[]' }
	 *   { name: 'replayProtection', type: 'ReplayProtection' } 
     * }>>
     */
    bytes32 constant INVOCATIONS_TYPEHASH = keccak256('Invocations(Invocation[] batch,ReplayProtection replayProtection)Caveat(address enforcer,bytes terms)Delegation(address delegate,bytes32 authority,Caveat[] caveats,bytes32 salt)Invocation(Transaction transaction,SignedDelegation[] authority)ReplayProtection(uint256 nonce,uint256 queue)SignedDelegation(Delegation delegation,bytes signature)Transaction(address to,uint256 gasLimit,bytes data)');

	/**
     * @dev Type hash representing the SignedInvocations data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * SIGNED_INVOCATIONS_TYPEHASH extends TypeHash<EIP712<{
     *   { name: 'invocations', type: 'Invocations' }
	 *   { name: 'signature', type: 'bytes' } 
     * }>>
     */
    bytes32 constant SIGNED_INVOCATIONS_TYPEHASH = keccak256('SignedInvocations(Invocations invocations,bytes signature)Caveat(address enforcer,bytes terms)Delegation(address delegate,bytes32 authority,Caveat[] caveats,bytes32 salt)Invocation(Transaction transaction,SignedDelegation[] authority)Invocations(Invocation[] batch,ReplayProtection replayProtection)ReplayProtection(uint256 nonce,uint256 queue)SignedDelegation(Delegation delegation,bytes signature)Transaction(address to,uint256 gasLimit,bytes data)');

	/**
     * @notice Instantiate the contract with the name and version of the protocol.
     * @param $name The name of the protocol.
     * @param $version The version of the protocol.
     * @dev The chainId is pulled from the block and the verifying contract is set to the
     *      address of the contract.
     */
    constructor(string memory $name, string memory $version) {
        /// @dev Sets the domain hash for the contract.
        domainHash = getEIP712DomainPacketHash(EIP712Domain({
            name: $name,
            version: $version,
            chainId: block.chainid,
            verifyingContract: address(this)
        }));
    }

	/**
     * @notice Encode EIP712Domain data into a packet hash and verify decoded EIP712Domain data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The EIP712Domain data to encode.
     * @return $packetHash The packet hash of the encoded EIP712Domain data.
     */
    function getEIP712DomainPacketHash(
        EIP712Domain memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            EIP712_DOMAIN_TYPEHASH,
            $input.name,
			$input.version,
			$input.chainId,
			$input.verifyingContract
        ));
    }

	/**
     * @notice Encode Delegation data into a packet hash and verify decoded Delegation data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The Delegation data to encode.
     * @return $packetHash The packet hash of the encoded Delegation data.
     */
    function getDelegationPacketHash(
        Delegation memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            DELEGATION_TYPEHASH,
            $input.delegate,
			$input.authority,
			getCaveatArrayPacketHash($input.caveats),
			$input.salt
        ));
    }

	/**
     * @notice Encode Caveat[] data into a packet hash and verify decoded Caveat[] data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The Caveat[] data to encode. 
     * @return $packetHash The packet hash of the encoded Caveat[] data.
     */
    function getCaveatArrayPacketHash(
        Caveat[] memory $input
    )  public pure virtual returns (bytes32 $packetHash) {
        bytes memory encoded;

        uint256 i;
        uint256 length = $input.length;

        for (i; i < length;) {
            encoded = bytes.concat(
                encoded,
                getCaveatPacketHash($input[i])
            );

            unchecked { i++; }
        }
        
        $packetHash = keccak256(encoded);
    }

	/**
     * @notice Encode Caveat data into a packet hash and verify decoded Caveat data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The Caveat data to encode.
     * @return $packetHash The packet hash of the encoded Caveat data.
     */
    function getCaveatPacketHash(
        Caveat memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            CAVEAT_TYPEHASH,
            $input.enforcer,
			keccak256($input.terms)
        ));
    }

	/**
     * @notice Encode Transaction data into a packet hash and verify decoded Transaction data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The Transaction data to encode.
     * @return $packetHash The packet hash of the encoded Transaction data.
     */
    function getTransactionPacketHash(
        Transaction memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            TRANSACTION_TYPEHASH,
            $input.to,
			$input.gasLimit,
			keccak256($input.data)
        ));
    }

	/**
     * @notice Encode SignedDelegation data into a packet hash and verify decoded SignedDelegation data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The SignedDelegation data to encode.
     * @return $packetHash The packet hash of the encoded SignedDelegation data.
     */
    function getSignedDelegationPacketHash(
        SignedDelegation memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            SIGNED_DELEGATION_TYPEHASH,
            getDelegationPacketHash($input.delegation),
			keccak256($input.signature)
        ));
    }

	/**
     * @notice Encode Invocation data into a packet hash and verify decoded Invocation data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The Invocation data to encode.
     * @return $packetHash The packet hash of the encoded Invocation data.
     */
    function getInvocationPacketHash(
        Invocation memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            INVOCATION_TYPEHASH,
            getTransactionPacketHash($input.transaction),
			getSignedDelegationArrayPacketHash($input.authority)
        ));
    }

	/**
     * @notice Encode SignedDelegation[] data into a packet hash and verify decoded SignedDelegation[] data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The SignedDelegation[] data to encode. 
     * @return $packetHash The packet hash of the encoded SignedDelegation[] data.
     */
    function getSignedDelegationArrayPacketHash(
        SignedDelegation[] memory $input
    )  public pure virtual returns (bytes32 $packetHash) {
        bytes memory encoded;

        uint256 i;
        uint256 length = $input.length;

        for (i; i < length;) {
            encoded = bytes.concat(
                encoded,
                getSignedDelegationPacketHash($input[i])
            );

            unchecked { i++; }
        }
        
        $packetHash = keccak256(encoded);
    }

	/**
     * @notice Encode ReplayProtection data into a packet hash and verify decoded ReplayProtection data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The ReplayProtection data to encode.
     * @return $packetHash The packet hash of the encoded ReplayProtection data.
     */
    function getReplayProtectionPacketHash(
        ReplayProtection memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            REPLAY_PROTECTION_TYPEHASH,
            $input.nonce,
			$input.queue
        ));
    }

	/**
     * @notice Encode Invocations data into a packet hash and verify decoded Invocations data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The Invocations data to encode.
     * @return $packetHash The packet hash of the encoded Invocations data.
     */
    function getInvocationsPacketHash(
        Invocations memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            INVOCATIONS_TYPEHASH,
            getInvocationArrayPacketHash($input.batch),
			getReplayProtectionPacketHash($input.replayProtection)
        ));
    }

	/**
     * @notice Encode Invocation[] data into a packet hash and verify decoded Invocation[] data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The Invocation[] data to encode. 
     * @return $packetHash The packet hash of the encoded Invocation[] data.
     */
    function getInvocationArrayPacketHash(
        Invocation[] memory $input
    )  public pure virtual returns (bytes32 $packetHash) {
        bytes memory encoded;

        uint256 i;
        uint256 length = $input.length;

        for (i; i < length;) {
            encoded = bytes.concat(
                encoded,
                getInvocationPacketHash($input[i])
            );

            unchecked { i++; }
        }
        
        $packetHash = keccak256(encoded);
    }

	/**
     * @notice Encode SignedInvocations data into a packet hash and verify decoded SignedInvocations data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The SignedInvocations data to encode.
     * @return $packetHash The packet hash of the encoded SignedInvocations data.
     */
    function getSignedInvocationsPacketHash(
        SignedInvocations memory $input
    ) public pure virtual returns (bytes32 $packetHash) {
        $packetHash = keccak256(abi.encode(
            SIGNED_INVOCATIONS_TYPEHASH,
            getInvocationsPacketHash($input.invocations),
			keccak256($input.signature)
        ));
    }

	/**
    * @notice Encode Delegation data into a digest hash.
    * @param $input The Delegation data to encode.
    * @return $digest The digest hash of the encoded Delegation data.
    */
    function getDelegationDigest(
        Delegation memory $input
    ) public view virtual returns (bytes32 $digest) {
        $digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainHash,
                getDelegationPacketHash($input)
            )
        );
    }

	/**
    * @notice Encode Caveat data into a digest hash.
    * @param $input The Caveat data to encode.
    * @return $digest The digest hash of the encoded Caveat data.
    */
    function getCaveatDigest(
        Caveat memory $input
    ) public view virtual returns (bytes32 $digest) {
        $digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainHash,
                getCaveatPacketHash($input)
            )
        );
    }

	/**
    * @notice Encode Transaction data into a digest hash.
    * @param $input The Transaction data to encode.
    * @return $digest The digest hash of the encoded Transaction data.
    */
    function getTransactionDigest(
        Transaction memory $input
    ) public view virtual returns (bytes32 $digest) {
        $digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainHash,
                getTransactionPacketHash($input)
            )
        );
    }

	/**
    * @notice Encode SignedDelegation data into a digest hash.
    * @param $input The SignedDelegation data to encode.
    * @return $digest The digest hash of the encoded SignedDelegation data.
    */
    function getSignedDelegationDigest(
        SignedDelegation memory $input
    ) public view virtual returns (bytes32 $digest) {
        $digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainHash,
                getSignedDelegationPacketHash($input)
            )
        );
    }

	/**
    * @notice Encode Invocation data into a digest hash.
    * @param $input The Invocation data to encode.
    * @return $digest The digest hash of the encoded Invocation data.
    */
    function getInvocationDigest(
        Invocation memory $input
    ) public view virtual returns (bytes32 $digest) {
        $digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainHash,
                getInvocationPacketHash($input)
            )
        );
    }

	/**
    * @notice Encode ReplayProtection data into a digest hash.
    * @param $input The ReplayProtection data to encode.
    * @return $digest The digest hash of the encoded ReplayProtection data.
    */
    function getReplayProtectionDigest(
        ReplayProtection memory $input
    ) public view virtual returns (bytes32 $digest) {
        $digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainHash,
                getReplayProtectionPacketHash($input)
            )
        );
    }

	/**
    * @notice Encode Invocations data into a digest hash.
    * @param $input The Invocations data to encode.
    * @return $digest The digest hash of the encoded Invocations data.
    */
    function getInvocationsDigest(
        Invocations memory $input
    ) public view virtual returns (bytes32 $digest) {
        $digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainHash,
                getInvocationsPacketHash($input)
            )
        );
    }

	/**
    * @notice Encode SignedInvocations data into a digest hash.
    * @param $input The SignedInvocations data to encode.
    * @return $digest The digest hash of the encoded SignedInvocations data.
    */
    function getSignedInvocationsDigest(
        SignedInvocations memory $input
    ) public view virtual returns (bytes32 $digest) {
        $digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                domainHash,
                getSignedInvocationsPacketHash($input)
            )
        );
    }


	/**
    * @notice Get the signer of a SignedDelegation data type.
    * @param $input The SignedDelegation data to encode.
    * @return $signer The signer of the SignedDelegation data.
    */
    function getSignedDelegationSigner(
        SignedDelegation memory $input
    ) public view virtual returns (address $signer) {
        $signer = getDelegationDigest($input.delegation).recover(
            $input.signature
        );
    }

	/**
    * @notice Get the signer of a SignedInvocations data type.
    * @param $input The SignedInvocations data to encode.
    * @return $signer The signer of the SignedInvocations data.
    */
    function getSignedInvocationsSigner(
        SignedInvocations memory $input
    ) public view virtual returns (address $signer) {
        $signer = getInvocationsDigest($input.invocations).recover(
            $input.signature
        );
    }
}