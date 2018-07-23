import {ConnectorCreator, ConnectorFacade} from "../connector";
import {Observable, Subject} from "rxjs";
import {NodeMessage} from "../../message/nodeMessage";
import {ConnectorSettings} from "../../configData";
import {filter, map} from "rxjs/operators";

export const virtualConnectorFactory: ConnectorCreator = (peers, settings, messagesToBroadcats: Observable<NodeMessage>) => settings.pipe(
    filter((s: ConnectorSettings) => s.type == "virtual"),
    map((settings: ConnectorSettings) => new VirtualConnector(settings, messagesToBroadcats)));


export class VirtualConnector implements ConnectorFacade {

    private bus: Subject<NodeMessage>;
    messages: Observable<NodeMessage>;

    constructor(settings: ConnectorSettings, messagesToBroadcats: Observable<NodeMessage>) {

        this.bus = settings.params.bus;

        this.messages = this.bus.pipe(
            filter((message: NodeMessage) => {
                return message.from != settings.id
            }),
        );

        //this.messages.pipe(withLatestFrom(aggregatedPeers),tap((a)=>console.log(a)));

        messagesToBroadcats.subscribe((message) => {

            const nextMessage = Object.assign(message, {from: settings.id});
            this.bus.next(nextMessage)
        })

    }
}






