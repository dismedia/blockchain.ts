import {Observable} from "rxjs/index";
import {NodeMessage} from "../message/nodeMessage";


export interface ConnectorFacade {
    broadcast(message: NodeMessage)
    connect(params: any)
    messages: Observable<NodeMessage>

}

export type ConnectorType=string;

export interface KnownNode{
    params:{
        host:string
    }
    type:ConnectorType
}

export interface ConnectorFactory{
    createConnector(type:ConnectorType):ConnectorFacade
}




