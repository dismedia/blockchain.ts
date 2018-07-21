import {Observable} from "rxjs/index";

export interface ConfigData {
}

export interface ConfigRepository{
    getConfig():Observable<ConfigData>;
}

