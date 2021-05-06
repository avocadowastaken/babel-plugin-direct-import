'use strict';

const runPlugin = require('../runPlugin');

describe('luxon', () => {
  it('transforms imports', () => {
    expect(
      runPlugin('import { DateTime, Interval, Duration } from "luxon"', [
        'luxon',
      ]),
    ).toMatchInlineSnapshot(`
      import DateTime from "luxon/src/datetime.js";
      import Interval from "luxon/src/interval.js";
      import Duration from "luxon/src/duration.js";
    `);
  });
});
