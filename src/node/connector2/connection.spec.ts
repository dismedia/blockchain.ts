import {PeerInfo} from "../connector/connector";
import {Observable, Subject} from "rxjs/Rx";
import {NodeMessage} from "../message/nodeMessage";
import {from} from "rxjs/index";

export interface SocketFactory {
    (socket): ConnectionFactory
}

export interface ConnectionFactory {
    (peer: PeerInfo, toBroadcast: Observable<NodeMessage>): Observable<NodeMessage>
}

export interface SocketClientBridge {

    connect(connectionParams): Promise<{
        send(m: NodeMessage): void
        messages: Observable<NodeMessage>
    }>

}

export const socketConnectionFactory: SocketFactory =

    (socket: SocketClientBridge) => {

        return (peer: PeerInfo, toBroadcast: Observable<NodeMessage>) => {

            const messages = new Subject<NodeMessage>()

            const connectAgain = (e) => {
                connect();
            }

            const connect = () => socket.connect(peer.connectionParms).then(socketConnection => {

                toBroadcast.subscribe((m: NodeMessage) => socketConnection.send(m))

                socketConnection.messages.subscribe((m) => messages.next(m),
                    (e) => {
                        connectAgain(e)
                    }, () => {
                        connectAgain(null)
                    })

            }).catch((e) => connectAgain(e))

            return from([]);

        }

    }

//export const peerConnection:PeerConnection

describe('socket connection factory ', function () {

    it('should create Connection', function (done) {

        const socket = {
            connect: () => {
                return Promise.resolve({
                    send: () => {
                    },
                    messages: from([])
                })
            }
        };

        const peer1: PeerInfo = {connectionParms: "", type: "test", id: "0"};
        const mtb = new Subject<NodeMessage>();

        const connectPeer = socketConnectionFactory(socket)

        connectPeer(peer1, mtb)

    });

});