export const g=0;

/*
export const websocketConnectorFactory: ConnectorCreator = (peers: Observable<PeerInfo[]>, settings, messagesToBroadcats: Observable<NodeMessage>) => settings.pipe(
    filter((s: ConnectorSettings) => s.type == "websocket"),
    map((settings: ConnectorSettings) => new WebsocketConnector(peers, settings, messagesToBroadcats)));


export class WebsocketConnector implements ConnectorFacade<NodeMessage> {
    messages: Observable<NodeMessage>;


    connectedPeers: Observable<PeerInfo[]>;

    constructor(peers: Observable<PeerInfo[]>, settings, messagesToBroadcast) {


        const actions = new Subject<PeerAction>();

        // this.connectedPeers = peerStoreFactory(actions);
        //
        // peers.pipe(
        //     withLatestFrom(this.connectedPeers),
        //
        //     map(([peers, connected]) => {
        //         return peers.filter(p => !connected.some(c => c.id == p.id))
        //     }),
        //     mergeMap((unconnectedArray) => from(unconnectedArray).pipe(
        //         mergeMap((unconected) => fromPromise(this.connectPeer(unconected)))
        //     )),
        // ).subscribe(a => console.log(a), (e) => console.log("cant connect " + e.id), () => console.log("done"))


        //peerStoreFactory(peerActions)

        // const wss=new WebSocket.Server({host:"localhost", port: 8885})
        //
        // wss.on('connection', function connection(ws) {
        //     ws.on('message', function incoming(message) {
        //         console.log('received: %s', message);
        //     });
        //
        //     ws.send('something');
        // });
        //


    }

    connectPeer(p) {
        console.log("connecting " + p.id);

        return new Promise((res, rej) => {

            console.log("connecting to websocket");

            const ws = new WebSocket("wss://echo.websocket.org");
            ws.onopen = (evt) => {

                console.log("websocketConeted");

                res(p)

            };


        });

        return Promise.resolve(p)
    }
}

*/
