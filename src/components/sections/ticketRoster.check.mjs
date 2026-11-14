// Run: node src/components/sections/ticketRoster.check.mjs
import assert from 'node:assert/strict';
import { ROSTER, reservedNumber } from './ticketRoster.js';

assert.equal(new Set(ROSTER).size, ROSTER.length, 'duplicate roster name');
ROSTER.forEach((name, index) => assert.equal(reservedNumber(name), index + 1, name));
assert.equal(reservedNumber('  yash   BAPAT '), 1);
assert.equal(reservedNumber('Ayaan Ameen'), 7);
assert.equal(reservedNumber('Rithvik Siddenki'), 21);
assert.equal(reservedNumber('Aditya'), null);
assert.equal(reservedNumber('Bapat'), null);
assert.equal(reservedNumber('Somebody Else'), null);
assert.equal(reservedNumber(''), null);
console.log('ticket roster ok');
