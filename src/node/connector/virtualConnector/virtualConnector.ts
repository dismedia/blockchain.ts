import {ConnectorFacade, PeerInfo} from "../connector";
import {combineLatest, from, Observable, Subject} from "rxjs";
import {NodeMessage} from "../../message/nodeMessage";
import {ConnectorSettings} from "../../configData";
import {filter, map, scan} from "rxjs/operators";


export interface ConnectorFactory {
    (settings: Observable<ConnectorSettings>,
     messagesToBroadcats: Observable<NodeMessage>,
     peers: Observable<PeerInfo>): Observable<ConnectorFacade>
}


export const virtualConnectorFactory: ConnectorFactory = ((settings, messagesToBroadcats: Observable<NodeMessage>, peers: Observable<PeerInfo>) => settings.pipe(
        filter((s: ConnectorSettings) => s.type == "virtual"),
        map((settings: ConnectorSettings) => new VirtualConnector(settings, messagesToBroadcats, peers)))
);

interface ConnectedVirtualPeer {
    peer: PeerInfo;


}

export class VirtualConnector implements ConnectorFacade {

    private bus: Subject<NodeMessage>;
    messages: Observable<NodeMessage>;
    public me: string = Math.random().toString();


    peerList: Observable<PeerInfo[]>;

    constructor(settings: ConnectorSettings, messagesToBroadcats: Observable<NodeMessage>, peers: Observable<PeerInfo>) {

        this.bus = settings.params.bus;
        this.messages = this.bus.pipe(filter((m: NodeMessage) => m.from != this.me && (<any>m).to == this.me));


        combineLatest(peers.pipe(
            filter(p => p.id != this.me),
            filter(p => p.type === "virtual"),

            scan((a, peer: PeerInfo) => {
                a.push(peer);
                return a;

            }, []),
            ), messagesToBroadcats,
        ).subscribe(a => {
            const [peers, message] = a;
            from(peers).subscribe((p: PeerInfo) => {
                const nextMessage = Object.assign(message, {to: p.id, from: this.me});
                this.bus.next(nextMessage)
            })
        })
    }


}






