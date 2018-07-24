import {WebsocketConnector} from "./src/node/connector/websocketConnector/websocketConnector";
import {PeerAction, peerStoreFactory} from "./src/node/connector/peer/peerStore";
import {PeerInfo} from "./src/node/connector/connector";
import {Subject} from "rxjs/Rx";

const actions = new Subject<PeerAction>();

const peers = peerStoreFactory(actions);
actions.next({action: "addPeer", payload: {id: "10", connectionParms: {}, type: "ws"} as PeerInfo});
actions.next({action: "addPeer", payload: {id: "12", connectionParms: {}, type: "ws"} as PeerInfo});
actions.next({action: "addPeer", payload: {id: "52", connectionParms: {}, type: "ws"} as PeerInfo});


new WebsocketConnector(peers, null, null);



