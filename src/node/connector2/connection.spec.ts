import {PeerInfo} from "../connector/connector";
import {Observable, Subject} from "rxjs";
import {NodeMessage} from "../message/nodeMessage";
import {from} from "rxjs/index";
import * as sinon from "sinon";

export interface SocketFactory {
    (socket): ConnectionFactory
}

export interface ConnectionFactory {

    (toBroadcast: Observable<NodeMessage>): (peer: PeerInfo) => Observable<NodeMessage>
}

export interface SocketClientBridge {

    connect(connectionParams): Promise<{
        send(m: NodeMessage): void
        messages: Observable<NodeMessage>
    }>

}

export const socketConnectionFactory: SocketFactory =

    (socket: SocketClientBridge) =>
        (toBroadcast: Observable<NodeMessage>) =>
            (peer: PeerInfo) => {

                const messages = new Subject<NodeMessage>()


                const connect = () => socket.connect(peer.connectionParms).then(socketConnection => {

                    toBroadcast.subscribe((m: NodeMessage) => socketConnection.send(m))

                    socketConnection.messages.subscribe((m) => messages.next(m))

                })

                return from([]);

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

        connectPeer(mtb)(peer1).subscribe(() => {
        }, () => {
        }, () => {
            connectSpy.called;
            done()
        })


    });

});