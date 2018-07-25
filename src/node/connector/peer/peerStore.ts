import {storeFactory} from "../../../mics/store/storeFactory";
import {ConnectedPeer, PeerInfo} from "../connector";
import {simpleReducerFactory, SimpleStoreAction} from "../../../mics/store/simpleReducer";

const comparer = (a: PeerInfo, b: PeerInfo) => a.id == b.id;

export const peerStoreFactory = storeFactory<SimpleStoreAction<PeerInfo>, PeerInfo[]>(simpleReducerFactory(comparer), []);

const comparerPeerWithConnectedPeer = (a: PeerInfo, b: ConnectedPeer) => a.id == b.peer.id;

export const connectedPeerStoreFactory = storeFactory<SimpleStoreAction<ConnectedPeer>, ConnectedPeer[]>(simpleReducerFactory(comparerPeerWithConnectedPeer), []);