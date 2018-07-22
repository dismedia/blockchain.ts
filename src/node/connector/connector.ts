import {Observable} from "rxjs";
import {NodeMessage} from "../message/nodeMessage";
import {ConnectorSettings} from "../configData";


export interface ConnectorFacade {
    messages: Observable<NodeMessage>;
    status?: Observable<any>;

}

export interface ConnectorCreator {
    (settings: Observable<ConnectorSettings>,
     messagesToBroadcats: Observable<NodeMessage>,
     peers: Observable<PeerInfo>): Observable<ConnectorFacade>
}

export type ConnectorType=string;
export type ConnectionStatus = "unknown" | "connected"

export type ConnectorStatusMessage = "started" | "connected" | "peerDiscovered"


export interface PeerInfo {
    connectionParms: any
    type: ConnectorType;
    id: string;


}





