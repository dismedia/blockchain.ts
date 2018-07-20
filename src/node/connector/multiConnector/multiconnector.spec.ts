import * as chai from "chai";
import {MultiConnector} from "./multiConnector";
import {ConnectorFactory, KnownNode} from "../connector";
import {from} from "rxjs/index";
import * as sinon from "sinon";

const assert = chai.assert;

describe("multiconnector", () => {

    it('should use factory for every known node type', () => {


        const knownNodes = from<KnownNode>([
            {
                type: "telepatic",
                params: {host: "brainOne"}

            },
            {
                type: "email",
                params: {host: "erica@lambert.hell"}

            }])


        const factoryResults={
            "telepatic": {connect:sinon.spy(),broadcast:()=>{},messages:null},
            "email": {connect:sinon.spy(),broadcast:()=>{},messages:null}

        }

        let connectorFactory: ConnectorFactory = {
            createConnector: (type)=>{
               return factoryResults[type]
            }
        }

        const sut = new MultiConnector(knownNodes, connectorFactory)

       //console.log(factoryResults.email.connect)

        assert.equal("brainOne", factoryResults.telepatic.connect.getCall(0).lastArg.host);
        assert.equal("erica@lambert.hell", factoryResults.email.connect.getCall(0).lastArg.host);

    });

});