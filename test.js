"use strict";
const test = require( "tape" );
const { diff, type, ObjectIterator } = require( "./diff" );
const _ = require( "lodash" );


test( "diff", t => {

    t.test( "Diff defines new types", t => {

        const types = {
            "array": [],
            "object": {},
            "null": null,
            "number": 1,
            "string": "string"
        };

        Object.keys( types ).forEach( typeString => {

            const value = types[ typeString ];
            t.ok( type( value ) === typeString, typeString );

        } );

        t.end();
    } );


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

            const
                expected = {
                    same: {},
                    previous: null,
                    next: null
                };


            t.ok(
                _.isEqual( diff( {}, {} ), expected )
            );

            t.ok(
                _.isEqual( diff( [], [] ), expected )
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
                    same: null
                };

            t.ok();

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

                t.end();

            } );

            t.test( "with an array", t => {

                const
                    previous = [ 1, 2 ],
                    next = [ 1, 3, 4 ],
                    expected = {
                        same: [ 1 ],
                        previous: [ undefined, 2 ],
                        next: [ undefined, 3, 4 ]
                    };

                const res = diff( previous, next );

                t.ok( _.isEqual( res, expected ) );

                t.end();

            } );

            t.end();

        } );

        t.end();

    } );

    t.end();
} );


test( "ObjectIterator", t => {

    const id = x => x;
    const iteratee = ( acc, value, key ) => {

        acc.push( [ value, key ] );
        return acc;

    };

    t.test( "with empty object", t => {

        const emptyObject = {};
        const emptyObjectIterator = new ObjectIterator( emptyObject );

        t.ok(
            _.isEqual( emptyObjectIterator.map( x => x ), [] ),
            "mapping returns empty array"
        );


        t.ok(
            _.isEqual(
                emptyObjectIterator.reduce( iteratee, [] ),
                []
            ),
            "reducing returns empty array"
        );

        t.end();

    } );


    t.test( "with non empty object", t => {

        const object = {
            a: 1,
            b: 2
        };
        const iterator = new ObjectIterator( object );
        t.ok(
            _.isEqual( iterator.map( id ), [ 1, 2 ] ),
            "mapping returns an array with the values"
        );

        t.ok(
            _.isEqual( iterator.reduce( iteratee, [] ),
                [
                    [ 1, "a" ],
                    [ 2, "b" ]
                ]
            ),
            "reducing an array of [value, key]"
        );

        t.end();

    } );

} );
