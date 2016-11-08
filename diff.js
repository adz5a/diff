"use strict";

class ObjectIterator {

    constructor ( object ) {

        this.object = object;
        this.keys = Object.keys( object );

    }


    map ( fn ) {

        return this.keys.map( key => {

            return fn( this.object[ key ], key );

        } );

    }

    reduce ( fn, acc ) {

        this.map( ( value, key ) => {

            acc = fn( acc, value, key );

        } );

        return acc;

    }

}

function type ( o ) {

    if ( o === null ) return "null";
    else {

        const t = typeof o;
        if ( t !== "object" ) {

            return t;

        } else {

            if ( Array.isArray( o ) ) return "array";
            else return "object";

        }

    }

}

function eq ( a, b ) {

    const ta = typeof a;

    if ( (typeof a === "number") && isNaN( a ) && isNaN( b ) ) {


        return true;

    } else {

        return a === b;

    }

}

function makeIterator ( object ) {

    if ( Array.isArray( object ) ) {

        return object;

    } else {

        return new ObjectIterator( object );

    }

}


function diff ( previous, next ) {


    const
        tp = type( previous ),
        tn = type( next );

    if ( tp !== "object" && tp !== "array" ) throw new TypeError( "diff : both args must be objects. Offender : first one" );
    if ( tn !== "object" && tn !== "array" ) throw new TypeError( "diff : both args must be objects. Offender : second one" );

    return _diff( previous, next );

}


/**
 *
 *
 *
 *
 */
function _diff ( previous, next ) {

    const
        tp = type( previous ),
        tn = type( next );


    if ( tp !== tn ) {

        //if types are different
        //then return a full diff

        return {
            same: null,
            previous,
            next
        };


    } else {

        //if types are the same
        //apply diffing algorithm
        //
        //First test deep Equality to handle 
        //the primitives
        if ( eq( previous, next ) ) {
            return {
                same: previous,
                previous: null,
                next: null
            };

        } else {
            // we have two structures
            // of the same type but not equals
            // so they are both data structures
            // of type array or object

            // we have to loop upon them
            // to compare each key and report
            // the diff
            const
                iNext = makeIterator( next ),
                iPrevious = makeIterator( previous );

            // apply alogirithm to diff 
            const
                sameValues = [],
                previousValues = [],
                nextValues = [],
                sameKeys = new Set();


            // we loop upon the next keys
            // to see if there is any match with previous keys
            // using
            iNext.map( ( value, key ) => {


                if ( !previous.hasOwnProperty( key ) ) {

                    nextValues.push( [ key, value ] );

                } else {

                    const prev = previous[ key ];
                    const
                        tp = type( prev ),
                        tn = type( value );

                    // if not equal we have two cases
                    if ( !eq( value, prev ) ) {

                        // same type and we have non strict equal data structure
                        if ( tp === tn && (tp === "array" || tp === "object") ) {

                            const { same, previous, next } = _diff( prev, value );

                            if ( previous !== null ) {

                                previousValues.push( [ key, prev ] );

                            }
                            if ( next !== null ) {

                                nextValues.push( [ key, next ] );

                            }
                            if ( same !== null ) {

                                sameValues.push( [ key, same ] );
                                sameKeys.add( key );

                            }

                        } else {
                            // we are dealing with primitives
                            // found only in one of the structures
                            previousValues.push( [ key, prev ] );
                            nextValues.push( [ key, value ] );

                        }


                    } else {
                        // if we have equality
                        // then we update the array
                        sameValues.push( [ key, value ] );
                        sameKeys.add( key );

                    }

                }


            } );

            //loop on the "previous" 
            //arg to store all own keys
            iPrevious.map( ( value, key ) => {

                if ( !sameKeys.has( key ) ) {

                    previousValues.push( [ key, value ] );

                }

            } );

            // we rebuild the data structures
            // according to their types
            if ( tn === "array" ) {
                //return values will be sparse arrays

                const diffValue = {};

                if ( previousValues.length === 0 ) {

                    diffValue.previous = null;

                } else {

                    diffValue.previous = new Array( previous.length );
                    previousValues.forEach( ( [key, value] ) => {

                        diffValue.previous[ key ] = value;

                    } );

                }

                if ( nextValues.length === 0 ) {
                    diffValue.next = null;
                } else {
                    diffValue.next = new Array( next.length );
                    nextValues.forEach( ( [key, value] ) => {

                        diffValue.next[ key ] = value;

                    } );
                }


                if ( sameKeys.size === 0 ) {

                    diffValue.same = null;

                } else {

                    diffValue.same = new Array( sameValues[ sameValues.length - 1 ][ 0 ] );
                    sameValues.forEach( ( [key, value] ) => {

                        diffValue.same[ key ] = value;

                    } );

                }

                return diffValue;
            } else {
                // we have objects
                // and it's a lot easier    
                const diffValue = {
                    same: {},
                    next: {},
                    previous: {}
                };


                if ( sameKeys.size === 0 ) {
                    diffValue.same = null;
                } else {
                    sameKeys.forEach( key => {

                        diffValue.same[ key ] = previous[ key ];

                    } );
                }


                if ( previousValues.length === 0 ) {
                    diffValue.previous = null;
                } else {
                    previousValues.forEach( ( [key, value] ) => {

                        diffValue.previous[ key ] = value;

                    } );
                }

                //console.log( nextValues );

                if ( nextValues.length === 0 ) {
                    diffValue.next = null;
                } else {
                    nextValues.forEach( ( [key, value] ) => {

                        diffValue.next[ key ] = value;

                    } );
                }


                return diffValue;
            }

        }

    }


}

module.exports = {
    diff,
    type,
    ObjectIterator
};

