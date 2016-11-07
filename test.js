"use strict";
const test = require("tape");
const { diff, type } = require("./diff");
const _ = require("lodash");

const a = {
    a: 1
};

const b = {
    b: 1
};



const d = diff(a, b);


const expect = {
    same: {},
    previous: {
        a: 1
    },
    next: {
        b: 1
    }
};



test("diff", t => {

    t.test("Diff defines new types", t => {
    
        const types = {
            "array": [],
            "object": {},
            "null": null,
            "number": 1,
            "string": "string"
        };

        Object.keys(types).forEach(typeString => {
        
            const value = types[typeString];
            t.ok(type(value) === typeString, typeString);
        
        });

        t.end(); 
    });
    

    t.test("diff does not accept non objects primitives", t => {
    
        const object = {};
        const nonObjects = [
            "string",
            null,
            1
        ];

        nonObjects.forEach(value => {
        
            t.throws(() => {
            
                diff(object, value);
            
            }, "throws with " + type(value) + " as second arg");


                        t.throws(() => {
            
                diff(value);
            
            }, "throws with " + type(value) + " as first arg");
        
        });


        t.end();
    
    });


    t.test("We have expected output", t => {
    
        t.ok(_.isEqual(expect, d));
        t.end();
    
    });

    t.end();
});


