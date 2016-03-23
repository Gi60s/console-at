"use strict";

['assert', 'dir', 'error', 'info', 'log', 'warn'].forEach(function(key) {
    var fn = console[key];
    fn.at = function() {
        var source = getSource(3);
        arguments[arguments.length] = '\n  at ' + source.source;
        arguments.length++;
        fn.apply(console, arguments);
    }
});



/**
 * Determine the file path, line number, and column number of where this
 * function was called from.
 * @param {number} backDepth Specify the number of lines to look back
 * on the stack trace.
 * @returns {{col: number, file: string, line: number, method: string, position: number, source: string}}
 */
function getSource(backDepth) {
    var err;
    var length;
    var orig;
    var result;
    var source;
    var stack;

    // initialize the result object
    result = {
        column: 0,
        file: '',
        line: 0,
        method: '',
        position: 0,
        source: ''
    };

    // store the original prepareStack trace function and stack length
    length = Error.stackTraceLimit;
    orig = Error.prepareStackTrace;

    // set the stack trace to the needed depth and overwrite the prepare stack trace function
    Error.stackTraceLimit = backDepth;
    Error.prepareStackTrace = prepareStackTrace;

    // capture the stack trace
    err = {};
    Error.captureStackTrace(err, source);
    stack = err.stack;

    // restore the prepare stack trace and stack limit
    Error.stackTraceLimit = length;
    Error.prepareStackTrace = orig;

    // get the first item from the stack
    source = stack[backDepth - 1];

    // update the result
    if (source) {
        result.column = source.getColumnNumber();
        result.file = source.getFileName();
        result.line = source.getLineNumber();
        result.method = source.getFunctionName();
        result.position = source.getPosition();
        result.source = result.file + ':' + result.line;
    }

    // add a toString method
    Object.defineProperty(result, 'toString', {
        enumerable: false,
        configurable: true,
        value: result.toString = function() {
            return result.source;
        }
    });

    return result;
}

function prepareStackTrace(_, stack) {
    return stack;
}