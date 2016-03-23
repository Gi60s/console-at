# console-at

Add console functions that also output where the call was made.

The console object has several useful functions defined as properties. Because functions are not primitive we can add properties to those functions. For each of the following functions, an `at` property is added that is called using the same parameters. It calls the original function plus adds information about where the function was called.

These functions are affected:

* assert
* dir
* error
* info
* log
* warn

**Example 1**

This still works.

```js
console.log('Hello, World!');
// Hello, World!
```

**Example 2**

We can also call the log function with location information:

```js
console.log.at('Hello, World!');
// Hello, World!
//   at /path/to/file.js: 1
```