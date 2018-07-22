import {Observable} from "rxjs";
import {NodeMessage} from "../message/nodeMessage";


export interface ConnectorFacade {
    messages: Observable<NodeMessage>;
    status?: Observable<any>;

}

export type ConnectorType=string;
export type ConnectionStatus = "unknown" | "connected"

export type ConnectorStatusMessage = "started" | "connected" | "peerDiscovered"


export interface PeerInfo {
    connectionParms: any
    type: ConnectorType;
    id: string;


}

export interface ConnectorFactory{
    createConnector(type:ConnectorType):ConnectorFacade
}




