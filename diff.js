"use strict";

class ObjectIterator {

    constructor(object) {
    
        this.object = object;
        this.keys = Object.keys(object);
    
    }



    map (fn) {
    
        return this.keys.map(key => {
        
            return fn(this.object[key], key);
        
        });
    
    }

    reduce(fn, acc) {
    
        this.map((value, key) => {
        
            acc = fn(acc, value, key);
        
        });

        return acc;
    
    }

}

function type (o) {

    if (o === null) return "null";
    else {
    
        const t = typeof o;
        if (t !== "object") {
        
            return t;
        
        } else {
        
            if (Array.isArray(o)) return "array";
            else return "object";
        
        }
    
    }

}

function eq(a, b) {
    
    if (isNaN(a) && isNaN(b)) {
    
        return true;
    
    } else {
    
        return a === b;
    
    }

}

function makeIterator (object) {

    if (Array.isArray(object)) {
    
        return object;
    
    } else {
    
        return new ObjectIterator(object);
    
    }

}

function reduce (iterator) {

    

}



function diff (previous, next) {

    
   const 
        tp = type(previous),
        tn = type(next);
   
    if (tp !== "object" && tp !== "array") throw new TypeError("diff : both args must be objects. Offender : first one");    
    if (tn !== "object" && tn !== "array") throw new TypeError("diff : both args must be objects. Offender : second one");    

    return _diff(previous, next);

}


/**
 *
 *
 *
 *
 */
function _diff (previous, next) {

    const 
        tp = type(previous),
        tn = type(next);
   

    
    if (tp !== tn) {
        
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
        if (eq(previous, next)) {
        
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
                iNext = makeIterator(next),
                iPrevious = makeIterator(previous);
        
            // apply alogirithm to diff 
            if (tn === "object") {
            
                const same = previousMap();
            
            } else {  }


        }
    
    }
    

}

module.exports = {
    diff,
    type,
    ObjectIterator
};

