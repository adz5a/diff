"use strict";

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

function makeIterator (object) {

    if (Array.isArray(object)) {
    
        return object;
    
    } else {}

}

function reduce (iterator) {

    

}



function diff (previous, next) {

    
   const 
        tp = type(previous),
        tn = type(next);
   
    if (tp !== "object" && tp !== "array") throw new TypeError("diff : both args must be objects. Offender : first one");    
    if (tn !== "object" && tn !== "array") throw new TypeError("diff : both args must be objects. Offender : second one");    


}




module.exports = {
    diff,
    type
};

