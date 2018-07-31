import {from, interval, Observable, of, pipe, zip} from "rxjs";
import {catchError, delay, filter, finalize, map, mapTo, mergeAll, mergeMap, scan, skip, take} from "rxjs/operators";
import * as sinon from "sinon";
import * as chai from "chai";

import {only} from "../../mics/only";


const assert = chai.assert;


describe('distinct scan', function () {

    it('should create new stream for every new element in array', function (done) {

        let spy = sinon.spy();

        const elementStreamCreator: ElementStreamCreator<number, number> = (e: number) => {

            spy();
            return interval(100).pipe(mapTo(e));
        };

        of([1, 2, 3]).pipe(
            distinctCreate<number, number>(elementStreamCreator),
            only(2)
        ).subscribe(e => {

            assert.equal(e[0], 3);
            assert.equal(spy.callCount, 3);

            done()
        })


    });

    it('should not create stream considered as existing', function (done) {


        let spy = sinon.spy();

        const elementStreamCreator: ElementStreamCreator<number, number> = (e: number) => {
            spy();
            return interval(100).pipe(mapTo(e))

        };

        from([[1, 2, 3], [1, 2, 3], [8]]).pipe(
            distinctCreate<number, number>(elementStreamCreator),
            skip(3),
            take(1)
        ).subscribe(e => {

            assert.equal(e, 8);
            assert.equal(spy.callCount, 4);

            done()
        })


    });


    it('should catch 8\' error', (done) => {


        let spy = sinon.spy();

        const elementStreamCreator: ElementStreamCreator<number, number> = (e: number) => {
            spy();
            if (e == 8) {
                return of(8).pipe(
                    delay(10),
                    map(() => {
                        throw "cr@p"
                    })
                );
            }

            return interval(250).pipe(mapTo(e), take(10));
        };

        from([[1, 2, 3], [8], [4]]).pipe(
            distinctCreate<number, number>(elementStreamCreator),
            only(3),
        ).subscribe(e => {

            assert.equal(e[0], 4);
            assert.equal(spy.callCount, 5);

            done()


        }, (e) => {
            throw "this should be already catched"
        })


    });

    it('should let to create another stream for same params if last one completes', (done) => {


        let spy = sinon.spy();


        const elementStreamCreator: ElementStreamCreator<number, number> = (e: number) => {
            spy();

            if (e == 1) {
                return of(e).pipe(
                    delay(100),
                    map(() => {
                        throw "cr@p"
                    })
                )
            }
            return interval(1000).pipe(mapTo(e))


        }


        zip(from([[1], [1], [2], [1, 2], [3]]), interval(200)).pipe(
            map(a => a[0]),
            distinctCreate<number, number>(elementStreamCreator),


            only(1)
        ).subscribe(e => {


            assert.equal(e[0], 3);
            assert.equal(spy.callCount, 5);

            //done()


        }, (e) => {
            console.log("should not be here")
        }, () => {
            done();
        })


    }).timeout(5000)

})


interface ElementStreamCreator<T, K> {
    (params: T): Observable<K>
}

interface IndicatedtedStream<T, K> {
    stream: Observable<K>,
    identify: (t: T) => boolean
    //remove:(a:IndicatedtedStream<T, K>[])=>void
}

interface DistinctAcumulator<T, K> {
    acumulated: IndicatedtedStream<T, K>[]
    news: Observable<K>[]

    acum2: Observable<IndicatedtedStream<T, K>[]>
}

const distinctCreate = <T, K>(elementStreamCreator) => pipe(
    scan((a: DistinctAcumulator<T, K>, newElements: T[]) => {


        const n = newElements.filter((e: T) => !a.acumulated.filter(a => a.identify != null).some((existingStream) => existingStream.identify(e)))
                .map((e: T) => ({
                        stream: elementStreamCreator(e),
                        identify: (p) => p == e

                    }) as IndicatedtedStream<T, K>
                );


            const finalizeableOutput = n.map((e: IndicatedtedStream<T, K>) => {
                return e.stream.pipe(
                    catchError(() => {
                        return from([]);
                    }),
                    finalize(() => {
                        e.identify = null;
                        return from([]);
                    })
                )
            });


            return {
                acumulated: [...a.acumulated, ...n].filter(a => a.identify != null),
                news: finalizeableOutput
            } as DistinctAcumulator<T, K>
        }, {acumulated: [], news: []}
    ),
    filter(s => s.news.length > 0),
    mergeMap(s => {
        return s.news
    }),
    mergeAll()
);


// {
//     acumulated:[],
//         current:null
// }