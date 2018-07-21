import {ConfigData, ConfigRepository} from "../configRepository";
import {Observable, ReplaySubject} from "rxjs";
import * as NodeStorage from "node-storage"



export class NodeStorageConfigRepository implements ConfigRepository {

    private subject:ReplaySubject<ConfigData>=new ReplaySubject<ConfigData>(1);

    private defaultConfig:ConfigData= {
        connectors: {
            websocet: {
                port: 8870
            }
        }
    };

    constructor() {
        const store = new NodeStorage('node.config');

        let config=store.get('config');
        if(!config) {
            config=this.defaultConfig;
            store.put("config",this.defaultConfig);
        }

        this.subject.next(config)

    }

    getConfig(): Observable<ConfigData> {

       return null;
    }

}