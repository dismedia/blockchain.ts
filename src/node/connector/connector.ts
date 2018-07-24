import {Observable} from "rxjs";
import {NodeMessage} from "../message/nodeMessage";
import {mergeMap, withLatestFrom} from "rxjs/operators";
import {PromiseFromObject} from "../../mics/abstract";
import {from} from "rxjs/index";
import {Connector} from "./virtualConnector/virtualConnector";


export const connectorFactory: (connectionCreator: PeerConnectionCreator<PeerInfo>) => ConnectorCreator = (connectionCreator: PeerConnectionCreator<PeerInfo>) => (peers, messagesToBroadcats: Observable<NodeMessage>) => new Connector(connectionCreator, peers, messagesToBroadcats);


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

interface SocketPeer<Message> {
    (messagesToBroadcast: Observable<Message>): { peer: PeerInfo, connection: ConnectorFacade<Message> }
}

export interface PeerConnectionCreator<ConnectedPeer> {

    (peers: Observable<PeerInfo>): Observable<ConnectedPeer>

}

export interface AsyncPeerConnectionFactory {
    (socket: Observable<AsyncConnectable<PeerInfo, PeerInfo>>): PeerConnectionCreator<PeerInfo>
}

export const asyncPeerConnectionFactory: AsyncPeerConnectionFactory =
    (websocket: Observable<any>) =>
        (peers: Observable<PeerInfo>) =>
            peers.pipe(
                withLatestFrom(websocket),
                mergeMap(combined => {
                    const [peer, websocket] = combined
                    return from(websocket.connectPeer(peer))
                }),
            )

export interface AsyncConnectable<I, O> {

    connectPeer: PromiseFromObject<I, O>

}
