import { getConfigExports } from '../../utils/getConfigExports';

it('resolves exports for `luxon`', () => {
  expect(getConfigExports({ name: 'luxon' })).toMatchInlineSnapshot(`
    Map {
      "DateTime" => Object {
        "external": "DateTime",
        "internal": "DateTime",
        "source": "luxon/src/datetime.js",
      },
      "Duration" => Object {
        "external": "Duration",
        "internal": "Duration",
        "source": "luxon/src/duration.js",
      },
      "Interval" => Object {
        "external": "Interval",
        "internal": "Interval",
        "source": "luxon/src/interval.js",
      },
      "Info" => Object {
        "external": "Info",
        "internal": "Info",
        "source": "luxon/src/info.js",
      },
      "Zone" => Object {
        "external": "Zone",
        "internal": "Zone",
        "source": "luxon/src/zone.js",
      },
      "FixedOffsetZone" => Object {
        "external": "FixedOffsetZone",
        "internal": "FixedOffsetZone",
        "source": "luxon/src/zones/fixedOffsetZone.js",
      },
      "IANAZone" => Object {
        "external": "IANAZone",
        "internal": "IANAZone",
        "source": "luxon/src/zones/IANAZone.js",
      },
      "InvalidZone" => Object {
        "external": "InvalidZone",
        "internal": "InvalidZone",
        "source": "luxon/src/zones/invalidZone.js",
      },
      "LocalZone" => Object {
        "external": "LocalZone",
        "internal": "LocalZone",
        "source": "luxon/src/zones/localZone.js",
      },
      "Settings" => Object {
        "external": "Settings",
        "internal": "Settings",
        "source": "luxon/src/settings.js",
      },
    }
  `);
});
