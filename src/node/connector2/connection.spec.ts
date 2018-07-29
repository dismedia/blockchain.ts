import {PeerInfo} from "../connector/connector";
import {Observable, Subject} from "rxjs";
import {NodeMessage} from "../message/nodeMessage";
import {from} from "rxjs/index";
import * as sinon from "sinon";

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

    it('should create use socket bridge to create connection', function (done) {

        const connectSpy = sinon.spy();

        const socketBridge: SocketClientBridge = {

            connect: () => {
                connectSpy();

                return Promise.resolve({
                    send: () => {
                    },
                    messages: from([])
                })
            }
        };

        const peer1: PeerInfo = {connectionParms: "", type: "test", id: "0"};
        const mtb = new Subject<NodeMessage>();

        const connectPeer = socketConnectionFactory(socketBridge)

        connectPeer(peer1, mtb).subscribe(() => {
        }, () => {
        }, () => {
            connectSpy.called;
            done()
        })



    });

});