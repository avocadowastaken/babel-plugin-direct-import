import { getConfigExports } from '../../utils/getConfigExports';

it('resolves exports for `luxon`', () => {
  expect(getConfigExports({ name: 'luxon' })).toMatchInlineSnapshot(`
    Map {
      "DateTime" => Object {
        "external": "DateTime",
        "internal": "default",
        "source": "luxon/src/datetime.js",
      },
      "Duration" => Object {
        "external": "Duration",
        "internal": "default",
        "source": "luxon/src/duration.js",
      },
      "Interval" => Object {
        "external": "Interval",
        "internal": "default",
        "source": "luxon/src/interval.js",
      },
      "Info" => Object {
        "external": "Info",
        "internal": "default",
        "source": "luxon/src/info.js",
      },
      "Zone" => Object {
        "external": "Zone",
        "internal": "default",
        "source": "luxon/src/zone.js",
      },
      "FixedOffsetZone" => Object {
        "external": "FixedOffsetZone",
        "internal": "default",
        "source": "luxon/src/zones/fixedOffsetZone.js",
      },
      "IANAZone" => Object {
        "external": "IANAZone",
        "internal": "default",
        "source": "luxon/src/zones/IANAZone.js",
      },
      "InvalidZone" => Object {
        "external": "InvalidZone",
        "internal": "default",
        "source": "luxon/src/zones/invalidZone.js",
      },
      "LocalZone" => Object {
        "external": "LocalZone",
        "internal": "default",
        "source": "luxon/src/zones/localZone.js",
      },
      "Settings" => Object {
        "external": "Settings",
        "internal": "default",
        "source": "luxon/src/settings.js",
      },
    }
  `);
});
