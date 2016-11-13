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

function rebuildObject ( valueKeys ) {

    return valueKeys.reduce( ( object, [key, value] ) => {

        object[ key ] = value;
        return object;

    }, {} );

}


function rebuildArray ( valueKeys ) {

    return valueKeys.reduce( ( object, [key, value] ) => {

        object[ key ] = value;
        return object;

    }, [] );

}

function rebuildMap ( keyValues ) {

    return new Map( keyValues );

}

function rebuildSet ( keyValues ) {

    return new Set( keyValues );

}

function diffObject ( object1, object2, { diff, rebuild } ) {


    const
        object1UniqueKeyValues = [],
        object2UniqueKeyValues = [],
        sameKeyValues = [];

    const sameKeys = new Set();

    const
        keys1 = new Set( Object.keys( object1 ) ),
        keys2 = Object.keys( object2 );


    keys2.forEach( key2 => {

        if ( keys1.has( key2 ) ) {

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

    keys1.forEach( key1 => {

        if ( !sameKeys.has( key1 ) ) {

            object1UniqueKeyValues.push( [ key1, object1[ key1 ] ] );

        }

    } );

    return {
        same: sameKeyValues.length > 0 ? rebuild( sameKeyValues ) : null,
        previous: object1UniqueKeyValues.length > 0 ? rebuild( object1UniqueKeyValues ) : null,
        next: object2UniqueKeyValues.length > 0 ? rebuild( object2UniqueKeyValues ) : null
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

const dispatch = {
    map: {
        diff: diffObject,
        rebuild: rebuildMap
    },
    array: {
        diff: diffObject,
        rebuild: rebuildArray
    },
    object: {
        diff: diffObject,
        rebuild: rebuildObject
    },
    set: {
        diff: diffSet,
        rebuild: () => {}
    }
};

function _diff ( o1, o2 ) {

    const t = type( o1 );
    return dispatch[ t ].diff( o1, o2, {
        rebuild: dispatch[ t ].rebuild,
        diff: _diff
    } );

}

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

        return _diff( o1, o2 );

    }

}

module.exports = { type, diffable, rebuildObject, diffObject, rebuildArray, rebuildSet, rebuildMap, diff };