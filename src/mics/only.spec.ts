import * as chai from "chai";
import {from, interval, noop, zip} from "rxjs/index";
import {only} from "./only";
import {map, tap} from "rxjs/internal/operators";
import * as sinon from "sinon";

const assert = chai.assert;


describe('only', function () {

    it('should take only pointed item', function (done) {

        const spy = sinon.spy();

        from([10, 20, 30, 40, 50, 60]).pipe(
            only(4),
        )
            .subscribe((e) => {
                assert.equal(e[0], 50)

                done()
            })


    })

    it('should take only pointed items', function (done) {

        const spy = sinon.spy();

        from([10, 20, 30, 40, 50, 60]).pipe(
            only(0, 1, 3),
            tap((e) => spy(e))
        )
            .subscribe((e) => {
                assert.deepEqual(e, [10, 20, 40])

                done()
            })


    })


    it('zip', function (done) {


        zip(from([[10], [20], [30], [10]]), interval(300)).pipe(map(a => a[0]),).subscribe((e) => {

            console.log(e)

        }, noop, () => {
            done()
        })

    })
})
