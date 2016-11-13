# README

Recursive diffing algorithm on JavaScript Arrays and Plain Objects.

# Rationale
Inspired by Clojure's data/diff module from [here](https://clojuredocs.org/clojure.data/diff).

Data in JavaScript is frequently stored in Arrays / Objects and it may be useful to be able to diff
them. This is what this module provides. 




# Installation & usage

`npm install data-diff` Note : waiting to be published on npm




You use it by passing two versions of a same "model", it will return an object with three keys :
- previous : keys / values only presents in the "previous" version
- same : keys / values presents in both versions
- next : keys / values presents in the next version

The value `null` is used when no correspondances are found between the two.


### Example 1
With objects sharing keys

```
const { diff } = require("data-diff")

const d1 = {
    a: 1,
    b: 2,
    c: 3
}
const d2 = {
    a: 3,
    b: 2,
    d: 4
};

const { previous, same, next } = diff(d1, d2);


/*
values only found in
previous = {
    a: 1,
    c: 3
}
same = {
    b: 2
}
next = {
    a: 3,
    d: 4
}

*/

```

### Example 2
With objects not sharing keys

```
const d1 = {
    a: 1
};
const d2 = {
    b: 1
};
const {previous, same, next} = diff(d1, d2);

/**
previous = { a: 1 }
same = null
next = { b: 1 }
**/

```

### Example 3
With arrays

```
const d1 = [1, 2];
const d2 = [3, 2];

const {previous, same, next} = diff(d1, d2);
/**
previous = [1, undefined];
same = [undefined, 2];
next = [3, undefined];

**/

```
# Todo 
- migrate tests from **tape** to **mocha**
- add supports for Maps/WeakMaps and Sets/WeakSets
- provide an high-level api to add support for custom data structure.
- provide minified build for use in the browser with source maps and co.
- provide an example of React Component wrapping MVC libraries using diffing pattern (Google Maps and Highcharts are the primary targets of this effort).


# Warning

This package supports diffing sequential data structures but does not offer guarantees as
to what objects are returned. It may (should, maybe) change in the future but if no differences
are found between objects we do not guarantee that the structure returned is the original object.

This is the case because JavaScript does not support Immutable data structure and it would introduce
subtle behaviour in the structures returned.

However you can easely know if a structure is contained in a another (or if they differ entirely)
by testing for null in the keys returned, for instance :
- `same === null` means that there is no key sharing between the structures
- `previous === null` means that it is entirely contained inside the next one (respectively `next === null`).

There is an exception though when both of the structures are empty. In this case all `{same, previous, next}` are `null`.


