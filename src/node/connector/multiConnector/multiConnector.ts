import {ConnectorFacade, ConnectorFactory, ConnectorType, KnownNode} from "../connector";
import {NodeMessage} from "../../message/nodeMessage";
import {Observable} from "rxjs/index";

export class MultiConnector implements ConnectorFacade {

    messages: Observable<NodeMessage>;

    connectors: { type: ConnectorType, facade: ConnectorFacade }[];

    broadcast(message: NodeMessage) {

        this.connectors.forEach(c => c.facade.broadcast(message))

    }

    connect(params: any) {
        //multiconnector cannot connect directly
    }

    constructor(knownNodes: Observable<KnownNode>, connectorFactory: ConnectorFactory) {
        this.connectors = [];

        knownNodes.subscribe((kn: KnownNode) => {
            let connector = this.connectors.find(c => kn.type == c.type);


            if (!connector) {
                connector = {facade: connectorFactory.createConnector(kn.type), type: kn.type}
                this.connectors.push(connector)



            }

            connector.facade.connect(kn.params);
        })

    }


}