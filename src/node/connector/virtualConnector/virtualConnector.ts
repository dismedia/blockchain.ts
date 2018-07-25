import {AsyncConnectable, ConnectedPeer, ConnectorFacade, PeerConnectionCreator, PeerInfo} from "../connector";
import {Observable, Subject} from "rxjs";
import {NodeMessage} from "../../message/nodeMessage";
import {connectedPeerStoreFactory, peerStoreFactory} from "../peer/peerStore";
import {collectionDifference} from "../../../mics/collectionsAgregator";
import {tap, withLatestFrom} from "rxjs/internal/operators";
import {SimpleStoreAction, SimpleStoreActionType as act} from "../../../mics/store/simpleReducer";

export class Connector implements ConnectorFacade<NodeMessage> {

    messages: Subject<NodeMessage> = new Subject<NodeMessage>();

    constructor(connectionCreator: PeerConnectionCreator, peers: Observable<PeerInfo[]>, messagesToBroadcats: Observable<NodeMessage>) {

        const pendingPeerAction = new Subject<SimpleStoreAction<PeerInfo>>();
        const connetcedPeerAction = new Subject<SimpleStoreAction<ConnectedPeer>>();

        const pendingPeers = peerStoreFactory(pendingPeerAction);
        const connectedPeers = connectedPeerStoreFactory(connetcedPeerAction);

        // pendingPeerAction.subscribe(a=>console.log("pending peer action",a));
        // connetcedPeerAction.subscribe(a=>console.log("connected peer action",a));

        const comparePeers = (a, b) => a.id == b.id;
        //const comparePeerWithConnectedPeer=(p:PeerInfo,cp:ConnectedPeer)=>p.id==cp.peer.id;

        const peerAboutToConnect = collectionDifference<PeerInfo, any>(comparePeers)(peers, pendingPeers);

        connectionCreator(peerAboutToConnect.pipe(
            tap((peer) => pendingPeerAction.next({action: act.add, payload: peer}))
        ))
            .subscribe((connectedPeer) => {

                connetcedPeerAction.next({action: act.add, payload: connectedPeer});
                pendingPeerAction.next({action: act.remove, payload: connectedPeer.peer});

                connectedPeer.connection.receive.subscribe((m) => this.messages.next(m));

            })

        messagesToBroadcats.pipe(
            //tap((m) => console.log("got message to bradcast")),
            withLatestFrom(connectedPeers),
            tap(combined => {
                const [m, pees] = combined;

                pees.forEach((p: ConnectedPeer) => p.connection.send(m))
            })).subscribe(() => {
        })

    }
}

const virtualConnectableFactory: () => AsyncConnectable<PeerInfo, PeerInfo> =
    () => {

        return {
            connectPeer: (peer) => Promise.resolve(peer)
        }

    };





