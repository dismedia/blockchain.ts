import {storeFactory} from "../../../mics/store/storeFactory";
import {PeerInfo} from "../connector";

export interface PeerAction {

    action: "addPeer" | "removePeer"
    payload: PeerInfo

}

const reducer = (action: PeerAction, state: PeerInfo[]) => {

    const methods = {
        addPeer: (payload: PeerInfo) => {
            const newState = state.slice();
            newState.push(payload);
            return newState;
        },
        removePeer: (payload: PeerInfo) => {

            const newState = state.slice();
            const index = newState.findIndex(p => p.id == payload.id);
            newState.splice(index, 1);
            return newState
        }

    };

    if (methods[action.action]) {

        state = methods[action.action](action.payload);
    }

    return state
};

export const peerStoreFactory = storeFactory<PeerAction, PeerInfo[]>(reducer, []);