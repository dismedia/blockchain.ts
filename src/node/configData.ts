import {ConnectorType} from "./connector/connector";

export interface ConnectorSettings {
    type: ConnectorType
    params: any;
}

export interface ConfigData {

    connectors: ConnectorSettings[]

}