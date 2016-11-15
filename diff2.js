"use strict";
const diffable = new Set( [ "map", "set", "object", "array" ] );

function type ( o ) {

    if ( o === null ) return "null";
    else {

        const t = typeof o;
        if ( t !== "object" ) {

            return t;

        } else {

            switch ( o.constructor ) {

                case Array:
                    return "array";
                case Map:
                    return "map";
                case Set:
                    return "set";
                default:
                    return "object";

            }

        }

    }

}

/*
 * A diffable Structure is a Javascript structures that supports the following behaviour :
 * - you can loop on its entries
 * - If it's key-valued you can know if it has a specific key (map, array, objects)
 * - else you can know if it has specific value (set)
 * - you can rebuild a substructure from it with [key values] pairs
 */

function diffObject ( object1, object2, { diff, rebuild, forEach, has } ) {


    const
        object1UniqueKeyValues = [],
        object2UniqueKeyValues = [],
        sameKeyValues = [];

    const sameKeys = new Set();


    forEach( object2, ( value, key2 ) => {

        if ( has( object1, key2 ) ) {

            sameKeys.add( key2 );

            const
                v1 = object1[ key2 ],
                v2 = object2[ key2 ],
                t1 = type( v1 ),
                t2 = type( v2 );

            if ( t1 === t2 && diffable.has( t1 ) ) {

                const { same, previous, next } = diff( v1, v2 );
                if ( same !== null ) {
                    sameKeyValues.push( [ key2, same ] );
                }
                if ( previous !== null ) {
                    object1UniqueKeyValues.push( [ key2, previous ] );
                }
                if ( next !== null ) {
                    object2UniqueKeyValues.push( [ key2, next ] );
                }

            } else if ( v1 === v2 ) {

                sameKeyValues.push( [ key2, v1 ] );

            } else {

                object2UniqueKeyValues.push( [ key2, v2 ] );
                object1UniqueKeyValues.push( [ key2, v1 ] );

            }

        } else {

            object2UniqueKeyValues.push( [ key2, object2[ key2 ] ] );

        }

    } );

    forEach( object1, ( value, key1 ) => {

        if ( !sameKeys.has( key1 ) ) {

            object1UniqueKeyValues.push( [ key1, object1[ key1 ] ] );

        }

    } );

    return {
        same: sameKeyValues.length > 0 ? rebuild( sameKeyValues, object2 ) : null,
        previous: object1UniqueKeyValues.length > 0 ? rebuild( object1UniqueKeyValues, object1 ) : null,
        next: object2UniqueKeyValues.length > 0 ? rebuild( object2UniqueKeyValues, object2 ) : null
    };


}

function diffSet ( s1, s2 ) {

    const
        same = new Set(),
        previous = new Set(),
        next = new Set();

    s2.forEach( value => {

        if ( s1.has( value ) ) {
            same.add( value );
        } else {
            next.add( value );
        }

    } );

    s1.forEach( value => {

        if ( !same.has( value ) ) {
            previous.add( value );
        }

    } );

    return {
        same: same.count > 0 ? same : null,
        previous: previous.count > 0 ? previous : null,
        next: next.count > 0 ? next : null
    };

}

const array = {
    forEach( array, fn ) {

        array.forEach( fn );

    },
    has( array, key ) {

        return array.hasOwnProperty( key );

    },
    get( array, key ) {
        return array[ key ];
    },
    rebuild( keyValues, original ) {

        const result = new Array( original.length );
        return keyValues.reduce( ( array, [key, value] ) => {

            array[ key ] = value;

            return array;
        }, result );

    },
    diff: diffObject
};
const object = {
    forEach( object, fn ) {

        Object.keys( object ).forEach( key => {
            fn( object[ key ], key );
        } );

    },
    has( object, key ){

        return object.hasOwnProperty( key );

    },
    get( object, key ) {
        return object[ key ];
    },
    rebuild( keyValues ) {
        return keyValues.reduce( ( object, [key, value] ) => {

            object[ key ] = value;
            return object;

        }, {} );

    },
    diff: diffObject
};
const map = {
    forEach( map, fn ) {

        map.forEach( fn );

    },
    has( map, key ) {

        return map.has( key );

    },
    get( map, key ) {
        return map.get( key );
    },
    rebuild( keyValues ) {
        return new Map( keyValues );

    },
    diff: diffObject
};


const set = {
    diff: diffSet
};


const dispatch = {
    map,
    array,
    object,
    set
};


function diff ( o1, o2 ) {


    const
        t1 = type( o1 ),
        t2 = type( o2 );
    if ( !diffable.has( t1 ) || !diffable.has( t2 ) ) {
        throw new TypeError( "Both args must be diffable" );
    } else if ( t1 !== t2 ) {

        return {
            same: null,
            previous: o1,
            next: o2
        };

    } else {

        const wrappedDispatch = {};
        const _diff = ( o1, o2 ) => {

            const t = type( o1 );

            return dispatch[ t ].diff( o1, o2, wrappedDispatch[ t ] );

        };

        dispatch.object.forEach( dispatch, ( methods, type ) => {

            wrappedDispatch[ type ] = Object.assign(
                {},
                methods,
                {
                    diff: _diff
                }
            );

        } );

        return _diff( o1, o2, wrappedDispatch[ t1 ] );

    }

}

module.exports = { type, diffable, diffObject, diff, dispatch };
