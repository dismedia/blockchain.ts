import * as chai from "chai";
import {PromiseFromObject} from "../../mics/abstract";
import {ConfigSource, storageConfigLoader} from "./storageConfigLoader";
import {from} from "rxjs";
import {map} from "rxjs/internal/operators";

const assert = chai.assert;

describe('storageConfigLoader', function () {

    it('should should emit config data for every config source, at any time', function (done) {

        const loader: PromiseFromObject<ConfigSource, any> = (source: ConfigSource) => {
            return new Promise((res) => {
                setTimeout(() => {

                    res({
                        takenFrom: source.path
                    })

                }, 100)
            })
        };


        const configSource = from<string>(["somepath/config0", "somepath/config1"])
            .pipe(
                map(e => ({path: e}))
            );

        const assertions = [
            (result: any) => {

                assert.equal(result.takenFrom, "somepath/config0")

            },
            (result: any) => {
                assert.equal(result.takenFrom, "somepath/config1")

            }
        ];

        storageConfigLoader(loader)(configSource).subscribe(r => assertions.shift()(r), () => {
        }, done)


    });

});