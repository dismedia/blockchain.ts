import {ConfigSource} from "../storageConfigLoader";
import * as NodeStorage from "node-storage"
import {PromiseFromObject} from "../../../mics/abstract";
import {ConfigData} from "../../configData";


export const nodeStorage:PromiseFromObject<ConfigSource,ConfigData> = (source: ConfigSource): Promise<ConfigData> => {

    const defaultConfig: ConfigData = {
        connectors: []
    };

    return new Promise((res, rej) => {

        const store = new NodeStorage(source.path);

        let config = store.get('config');
        if (!config) {
            config = defaultConfig;
            store.put("config", defaultConfig);
        }
        res(config)

    })
};


