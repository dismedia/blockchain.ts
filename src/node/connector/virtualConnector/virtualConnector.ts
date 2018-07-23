import {ConnectorCreator, ConnectorFacade, PeerInfo} from "../connector";
import {from, Observable, Subject} from "rxjs";
import {NodeMessage} from "../../message/nodeMessage";
import {ConnectorSettings} from "../../configData";
import {filter, map, scan, tap, withLatestFrom} from "rxjs/operators";

export const virtualConnectorFactory: ConnectorCreator = ((settings, messagesToBroadcats: Observable<NodeMessage>, peers: Observable<PeerInfo>) => settings.pipe(
        filter((s: ConnectorSettings) => s.type == "virtual"),
        map((settings: ConnectorSettings) => new VirtualConnector(settings, messagesToBroadcats, peers)))
);

export class VirtualConnector implements ConnectorFacade {

    private bus: Subject<NodeMessage>;
    messages: Observable<NodeMessage>;
    public me: string = Math.random().toString();

    peerList: Observable<PeerInfo[]>;

    constructor(settings: ConnectorSettings, messagesToBroadcats: Observable<NodeMessage>, peers: Observable<PeerInfo>) {

        this.bus = settings.params.bus;

        const aggregatedPeers: Observable<PeerInfo[]> = peers.pipe(
            filter(p => p.id != this.me),
            filter(p => p.type === "virtual"),

            scan((a, peer: PeerInfo) => {
                    a.push(peer);
                    return a;

                }, []
            ));

        this.messages = this.bus.pipe(
            filter((message: NodeMessage) => {
                return message.from != this.me && (<any>message).to == this.me
            }),
            tap(() => console.log(this.me + " got message")),
            withLatestFrom(aggregatedPeers),
            map(a => {

                console.log(this.me + " !")
                return a[0]
            })
        );

        //this.messages.pipe(withLatestFrom(aggregatedPeers),tap((a)=>console.log(a)));

        messagesToBroadcats.pipe(
            withLatestFrom(aggregatedPeers)
        ).subscribe((combined: any[]) => {
            const [message, peers] = combined;
            from(peers).subscribe((p: PeerInfo) => {
                const nextMessage = Object.assign(message, {to: p.id, from: this.me});
                this.bus.next(nextMessage)
            })
        })

    }
}






