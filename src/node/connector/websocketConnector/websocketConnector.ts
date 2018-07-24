import {ConnectorCreator, connectorFactory, PeerConnectionCreator} from "../connector";


export const websocketPeerConnectionCreator: PeerConnectionCreator = (peer) => {
    return peer
};

export const websocketConnectorCreator: ConnectorCreator = connectorFactory(websocketPeerConnectionCreator);
