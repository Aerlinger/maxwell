let assert = require('assert');

describe('Array', () => {
  describe('#indexOf()', () => {
    it('returns -1 when the value is not present', () => {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
