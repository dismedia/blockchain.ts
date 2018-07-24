import {Observable} from "rxjs";
import {NodeMessage} from "../message/nodeMessage";
import {mergeMap, withLatestFrom} from "rxjs/operators";
import {PromiseFromObject} from "../../mics/abstract";
import {from} from "rxjs/index";

export interface ConnectorFacade<Messages> {
    messages: Observable<Messages>;
    status?: Observable<any>;

}

export interface ConnectorCreator {
    (peers: Observable<PeerInfo[]>,
     messagesToBroadcats: Observable<NodeMessage>): ConnectorFacade<NodeMessage>
}

export type ConnectorType = string;
export type ConnectionStatus = "unknown" | "connected"

export type ConnectorStatusMessage = "started" | "connected" | "peerDiscovered"


export interface PeerInfo {
    connectionParms: any
    type: ConnectorType;
    id: string;

}

interface SocketPeer<Message> {
    (messagesToBroadcast: Observable<Message>): { peer: PeerInfo, connection: ConnectorFacade<Message> }
}

export interface PeerConnectionCreator {

    (peers: Observable<PeerInfo>): Observable<PeerInfo>

}

export interface AsyncPeerConnectionFactory {
    (socket: Observable<AsyncConnectable<PeerInfo, PeerInfo>>): PeerConnectionCreator
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
