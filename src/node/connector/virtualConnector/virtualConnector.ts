import {AsyncConnectable, ConnectorFacade, PeerConnectionCreator, PeerInfo} from "../connector";
import {Observable, Subject} from "rxjs";
import {NodeMessage} from "../../message/nodeMessage";
import {peerStoreFactory} from "../peer/peerStore";
import {collectionDifference} from "../../../mics/collectionsAgregator";
import {tap} from "rxjs/internal/operators";
import {SimpleStoreAction, SimpleStoreActionType as act} from "../../../mics/store/simpleReducer";


export class Connector implements ConnectorFacade<NodeMessage> {


    messages: Observable<NodeMessage>;

    constructor(connectionCreator: PeerConnectionCreator, peers: Observable<PeerInfo[]>, messagesToBroadcats: Observable<NodeMessage>) {

        const pendingPeerAction = new Subject<SimpleStoreAction<PeerInfo>>();
        const connetcedPeerAction = new Subject<SimpleStoreAction<PeerInfo>>();

        const pendingPeers = peerStoreFactory(pendingPeerAction);
        const connectedPeers = peerStoreFactory(connetcedPeerAction);

        // pendingPeerAction.subscribe(a=>console.log("pending peer action",a));
        // connetcedPeerAction.subscribe(a=>console.log("connected peer action",a));

        const comparePeers = (a, b) => a.id == b.id;
        //const comparePeerWithConnectedPeer=(p:PeerInfo,cp:ConnectedPeer)=>p.id==cp.perr.id;

        const peerAboutToConnect = collectionDifference<PeerInfo, any>(comparePeers)(peers, pendingPeers);

        connectionCreator(peerAboutToConnect.pipe(
            tap((peer) => pendingPeerAction.next({action: act.add, payload: peer}))
        ))
            .subscribe((peer) => {

                connetcedPeerAction.next({action: act.add, payload: peer});
                pendingPeerAction.next({action: act.remove, payload: peer});
            })

    }
}

export interface ConnectedPeer {
    perr: PeerInfo,
    connector: ConnectorFacade<NodeMessage>
}

const virtualConnectableFactory: () => AsyncConnectable<PeerInfo, PeerInfo> =
    () => {

        return {
            connectPeer: (peer) => Promise.resolve(peer)
        }

    };





