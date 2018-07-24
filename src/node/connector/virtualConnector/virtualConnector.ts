import {AsyncConnectable, ConnectorCreator, ConnectorFacade, PeerConnectionCreator, PeerInfo} from "../connector";
import {Observable, Subject} from "rxjs";
import {NodeMessage} from "../../message/nodeMessage";
import {PeerAction, peerStoreFactory} from "../peer/peerStore";
import {observableCollectionsDifferenceFactory} from "../../../mics/collectionsAgregator";
import {tap} from "rxjs/internal/operators";

export const connectorFactory: (connectionCreator: PeerConnectionCreator) => ConnectorCreator = (connectionCreator: PeerConnectionCreator) => (peers, messagesToBroadcats: Observable<NodeMessage>) => new Connector(connectionCreator, peers, messagesToBroadcats);

export class Connector implements ConnectorFacade<NodeMessage> {

    private bus: Subject<NodeMessage>;
    messages: Observable<NodeMessage>;

    constructor(connectionCreator: PeerConnectionCreator, peers: Observable<PeerInfo[]>, messagesToBroadcats: Observable<NodeMessage>) {

        const pendingPeerAction = new Subject<PeerAction>();
        const connetcedPeerAction = new Subject<PeerAction>();

        const pendingPeers = peerStoreFactory(pendingPeerAction);
        const connectedPeers = peerStoreFactory(connetcedPeerAction);

        // pendingPeerAction.subscribe(a=>console.log("pending peer action",a));
        // connetcedPeerAction.subscribe(a=>console.log("connected peer action",a));

        const comparePeers = (a, b) => {

            return a.id == b.id
        }

        const peerAboutToConnect = observableCollectionsDifferenceFactory<PeerInfo, any>(comparePeers)(peers, pendingPeers)

        connectionCreator(peerAboutToConnect.pipe(
            tap((peer) => pendingPeerAction.next({action: "addPeer", payload: peer}))
        ))
            .subscribe((peer) => {

                connetcedPeerAction.next({action: "addPeer", payload: peer})
                pendingPeerAction.next({action: "removePeer", payload: peer})
            })

    }
}

const virtualConnectableFactory: () => AsyncConnectable<PeerInfo, PeerInfo> =
    () => {

        return {
            connectPeer: (peer) => Promise.resolve(peer)
        }

    }





