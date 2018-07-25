import {Observable} from "rxjs";
import {NodeMessage} from "../message/nodeMessage";
import {PromiseFromObject} from "../../mics/abstract";
import {Connector} from "./virtualConnector/virtualConnector";

export const connectorFactory: (connectionCreator: PeerConnectionCreator) => ConnectorCreator = (connectionCreator: PeerConnectionCreator) => (peers, messagesToBroadcats: Observable<NodeMessage>) => new Connector(connectionCreator, peers, messagesToBroadcats);


export interface ConnectorCreator {
    (peers: Observable<PeerInfo[]>,
     messagesToBroadcats: Observable<NodeMessage>): ConnectorFacade<NodeMessage>
}

export interface ConnectorFacade<Messages> {
    messages: Observable<Messages>;
    status?: Observable<any>;

}

export type ConnectorType = string;


export interface PeerInfo {
    connectionParms: any
    type: ConnectorType;
    id: string;

}

export interface ConnectedPeer {
    peer: PeerInfo,
    connection: {
        receive: Observable<NodeMessage>
        send: (message: NodeMessage) => Promise<any>
    }
}

export interface PeerConnectionCreator {

    (peers: Observable<PeerInfo>): Observable<ConnectedPeer>

}


export interface AsyncConnectable<I, O> {

    connectPeer: PromiseFromObject<I, O>

}

// export interface AsyncPeerConnectionFactory {
//     (socket: Observable<AsyncConnectable<PeerInfo, PeerInfo>>): PeerConnectionCreator
// }
//
// export const asyncPeerConnectionFactory: AsyncPeerConnectionFactory =
//     (websocket: Observable<any>) =>
//         (peers: Observable<PeerInfo>) =>
//             peers.pipe(
//                 withLatestFrom(websocket),
//                 mergeMap(combined => {
//                     const [peer, websocket] = combined
//                     return from(websocket.connectPeer(peer))
//                 }),
//             )