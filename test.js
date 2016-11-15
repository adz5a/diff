"use strict";
const test = require( "tape" );
const { diff, type } = require( "./diff2" );
const _ = require( "lodash" );

test( "Diff defines new types", t => {

    const types = {
        "array": [],
        "object": {},
        "null": null,
        "number": 1,
        "string": "string",
        "set": new Set(),
        "map": new Map()
    };

    Object.keys( types ).forEach( typeString => {

        const value = types[ typeString ];
        t.ok( type( value ) === typeString, typeString );

    } );

    t.end();
} );


test( "diff", t => {

    t.test( "diff does not accept non objects primitives", t => {

        const object = {};
        const nonObjects = [
            "string",
            null,
            1
        ];

        nonObjects.forEach( value => {

            t.throws( () => {

                diff( object, value );

            }, "throws with " + type( value ) + " as second arg" );


            t.throws( () => {

                diff( value );

            }, "throws with " + type( value ) + " as first arg" );

        } );


        t.end();

    } );


    t.test( "We have expected output", t => {

        t.test( "When passing different data structure", t => {

            const
                a = { a: 1 },
                b = [ 1, 2 ],
                expected = {
                    same: null,
                    previous: a,
                    next: b
                };

            t.ok(
                _.isEqual( diff( a, b ), expected, "A full diff" )
            );

            t.end();

        } );

        t.test( "When passing same data structure", t => {

            const
                a = { a: 1 },
                expected = {
                    same: a,
                    previous: null,
                    next: null
                };

            t.ok(
                _.isEqual( diff( a, a ), expected, "A null diff" )
            );

            t.end();

        } );

        t.test( "when passing two empty data structures", t => {


            let d;
            d = diff( {}, {} );
            t.ok(
                _.isEqual( d, {
                    same: null,
                    previous: null,
                    next: null
                } )
            );

            d = diff( [], [] );
            t.ok(
                _.isEqual( d, {
                    same: null,
                    previous: null,
                    next: null
                } )
            );
            t.end();
        } );


        t.test( "when passing nested data structures", t => {

            const
                a = {
                    a: {
                        b: 1
                    }
                },
                b = {
                    a: {
                        b: 3
                    }
                },
                expected = {
                    same: null,
                    previous: {
                        a: {
                            b: 1
                        }
                    },
                    next: {
                        a: {
                            b: 3
                        }
                    }
                };

            t.ok(
                _.isEqual(
                    diff( a, b ),
                    expected
                )
            );

            t.end();
        } );

        t.test( "When passing the same data structure but with different items", t => {

            t.test( "with an object", t => {


                const
                    previous = {
                        a: 1,
                        b: 2
                    },
                    next = {
                        a: 1,
                        b: 3,
                        c: 4
                    },
                    expected = {
                        same: {
                            a: 1
                        },
                        previous: {
                            b: 2
                        },
                        next: {
                            b: 3,
                            c: 4
                        }
                    };

                t.ok(
                    _.isEqual(
                        diff( previous, next ),
                        expected
                    )
                );

                t.end();

            } );

            t.test( "test with no matching keys", t => {

                const
                    previous = {
                        a: 1,
                        b: 2
                    },
                    next = {
                        a: 2
                    },
                    expected = {
                        same: null,
                        previous: {
                            a: 1,
                            b: 2
                        },
                        next: {
                            a: 2
                        }
                    };


                const d = diff( previous, next );
                //console.log( d );
                t.ok(
                    _.isEqual(
                        d,
                        expected
                    )
                );

                t.ok(
                    _.isEqual(
                        diff( next, previous ),
                        {
                            same: null,
                            previous: {
                                a: 2
                            },
                            next: {
                                a: 1,
                                b: 2
                            }
                        }
                    )
                );

                t.end();

            } );

            t.test( "with an array", t => {

                const
                    previous = [ 1, 2 ],
                    next = [ 1, 3, 4 ],
                    expected = {
                        same: [ 1, undefined, undefined ],
                        previous: [ undefined, 2 ],
                        next: [ undefined, 3, 4 ]
                    };

                const res = diff( previous, next );


                t.ok( _.isEqual( res, expected ) );

                t.end();

            } );

            t.test( "test with arrays included in one another", t => {

                const set = [ 1, 2, 3 ];
                const subset = [ 1, 2 ];
                const expect = {
                    same: [ 1, 2 ],
                    previous: null,
                    next: [ undefined, undefined, 3 ]
                };

                const d = diff( subset, set );
                //console.log( d );
                t.ok(
                    _.isEqual( d, expect )
                );

                t.end();
            } );


            t.test( "test with array and objects", t => {

                const chart1 = {
                    chart: {
                        type: "line"
                    },
                    series: [
                        {
                            data: [ 1, 2, 3 ]
                        }
                    ]
                };

                const chart2 = {
                    chart: {
                        type: "line"
                    },
                    series: [
                        {
                            data: [ 1, 2, 3, 4 ]
                        }
                    ]
                };

                const expected = {
                    same: {
                        chart: {
                            type: "line"
                        },
                        series: [
                            {
                                data: [ 1, 2, 3 ]
                            }
                        ]
                    },
                    previous: null,
                    next: {
                        series: [
                            {
                                data: [ undefined, undefined, undefined, 4 ]
                            }
                        ]
                    }
                };

                t.ok(
                    _.isEqual(
                        diff( chart1, chart2 ),
                        expected
                    )
                );

                t.end();

            } );

            t.end();

        } );

        t.end();

    } );

    t.end();
} );


