import {storeFactory} from "../../../mics/store/storeFactory";
import {PeerInfo} from "../connector";
import {simpleReducerFactory, SimpleStoreAction} from "../../../mics/store/simpleReducer";


const comparer = (a: PeerInfo, b: PeerInfo) => a.id == b.id;

export const peerStoreFactory = storeFactory<SimpleStoreAction<PeerInfo>, PeerInfo[]>(simpleReducerFactory(comparer), []);