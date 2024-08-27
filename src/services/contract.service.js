/*
    A service to call the transmutation contract
 */
import { BN, BN_ONE } from "@polkadot/util";


const MAX_CALL_WEIGHT2 = new BN(1_000_000_000_000).isub(BN_ONE);
const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000_000);

export async function createIsland(etf, signer, name, transmutationContract, callback) {
    await transmutationContract.tx
        .createIsland({
            gasLimit: etf.createType('WeightV2', {
                refTime: MAX_CALL_WEIGHT2,
                proofSize: PROOFSIZE,
              }),
              storageDepositLimit: null,
        }, name)
        .signAndSend(signer.address, result => {
            // if (result.status.isInBlock) {
                callback(result);
            // }
        });
}

// export async function tryNewSwap(etf, signer, transmutationContract, who, when, callback) {
//     await transmutationContract.tx
//         .tryNewSwap({
//             gasLimit: etf.createType('WeightV2', {
//                 refTime: MAX_CALL_WEIGHT2,
//                 proofSize: PROOFSIZE,
//             }),
//             storageDepositLimit: null,
//         }, who, when)
//         .signAndSend(signer.address, result => {
//             if (result.status.isInBlock) {
//                 callback(result);
//             }
//         });
// }

// export async function rejectSwap(etf, signer, transmutationContract, callback) {
//     await transmutationContract.tx
//         .rejectSwap({
//             gasLimit: etf.createType('WeightV2', {
//                 refTime: MAX_CALL_WEIGHT2,
//                 proofSize: PROOFSIZE,
//             }),
//             storageDepositLimit: null,
//         })
//         .signAndSend(signer.address, result => {
//             if (result.status.isInBlock) {
//                 callback(result);
//             }
//         });
// }

// export async function complete(etf, signer, contract, swapId, callback) {
//     await contract.tx
//         .complete({
//             gasLimit: etf.createType('WeightV2', {
//                 refTime: MAX_CALL_WEIGHT2,
//                 proofSize: PROOFSIZE,
//             }),
//             storageDepositLimit: null,
//         }, swapId)
//         .signAndSend(signer.address, result => {
//             if (result.status.isInBlock) {
//                 callback(result);
//             }
//         });
// }

// export function transmute__call(etf, transmutationContract) {
//     return transmutationContract.tx
//         .transmute({
//             gasLimit: etf.createType('WeightV2', {
//                 refTime: MAX_CALL_WEIGHT2,
//                 proofSize: PROOFSIZE,
//             }),
//             storageDepositLimit: null,
//         });
// }

// export async function queryWorldRegistry(etf, signer, transmutationContract, who) {
//     const { gasRequired, storageDeposit, result, output } =  
//         await transmutationContract.query.registryLookup(signer.address, 
//             {
//                 gasLimit: etf.createType('WeightV2', {
//                     refTime: MAX_CALL_WEIGHT2,
//                     proofSize: PROOFSIZE,
//                 }),
//                 storageDepositLimit: null,
//             }, 
//         who,
//     );
//     return result.toHuman()
// }

// export async function queryClaimedAssets(etf, signer, transmutation) {
//     const { gasRequired, storageDeposit, result, output } =  
//         await transmutation.query.getClaimedAssets(signer.address, 
//             {
//                 gasLimit: etf.createType('WeightV2', {
//                     refTime: MAX_CALL_WEIGHT2,
//                     proofSize: PROOFSIZE,
//                 }),
//                 storageDepositLimit: null,
//             },
//     );
//     return output
// }

// export async function queryAssetOwner(etf, signer, transmutation, seed) {
//     const { gasRequired, storageDeposit, result, output } =  
//         await transmutation.query.getOwner(signer.address, 
//             {
//                 gasLimit: etf.createType('WeightV2', {
//                     refTime: MAX_CALL_WEIGHT2,
//                     proofSize: PROOFSIZE,
//                 }),
//                 storageDepositLimit: null,
//             }, seed,
//     );
//     return output
// }

// export async function getPendingSwap(etf, signer, transmutation) {
//     const { gasRequired, storageDeposit, result, output } =  
//         await transmutation.query.getPendingSwap(signer.address, 
//             {
//                 gasLimit: etf.createType('WeightV2', {
//                     refTime: MAX_CALL_WEIGHT2,
//                     proofSize: PROOFSIZE,
//                 }),
//                 storageDepositLimit: null,
//             },
//         );
//     return output
// }

// export async function getAssetSwapHash(etf, signer, transmutation, assetId) {
//     const { gasRequired, storageDeposit, result, output } =  
//     await transmutation.query.getAssetSwap(signer.address, 
//         {
//             gasLimit: etf.createType('WeightV2', {
//                 refTime: MAX_CALL_WEIGHT2,
//                 proofSize: PROOFSIZE,
//             }),
//             storageDepositLimit: null,
//         }, assetId,
//     );
//     return output
// }