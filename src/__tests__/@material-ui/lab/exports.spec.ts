import { getConfigExports } from '../../../utils/getConfigExports';

test('exports', () => {
  expect(getConfigExports({ name: '@material-ui/lab' })).toMatchInlineSnapshot(`
    Map {
      "Alert" => Object {
        "external": "Alert",
        "internal": "default",
        "source": "@material-ui/lab/esm/Alert/index.js",
      },
      "default" => Object {
        "external": "default",
        "internal": "default",
        "source": "@material-ui/lab/esm/TreeView/TreeView.js",
      },
      "AlertTitle" => Object {
        "external": "AlertTitle",
        "internal": "default",
        "source": "@material-ui/lab/esm/AlertTitle/index.js",
      },
      "Autocomplete" => Object {
        "external": "Autocomplete",
        "internal": "default",
        "source": "@material-ui/lab/esm/Autocomplete/index.js",
      },
      "createFilterOptions" => Object {
        "external": "createFilterOptions",
        "internal": "createFilterOptions",
        "source": "@material-ui/lab/esm/Autocomplete/Autocomplete.js",
      },
      "AvatarGroup" => Object {
        "external": "AvatarGroup",
        "internal": "default",
        "source": "@material-ui/lab/esm/AvatarGroup/index.js",
      },
      "Pagination" => Object {
        "external": "Pagination",
        "internal": "default",
        "source": "@material-ui/lab/esm/Pagination/index.js",
      },
      "usePagination" => Object {
        "external": "usePagination",
        "internal": "default",
        "source": "@material-ui/lab/esm/Pagination/usePagination.js",
      },
      "PaginationItem" => Object {
        "external": "PaginationItem",
        "internal": "default",
        "source": "@material-ui/lab/esm/PaginationItem/index.js",
      },
      "Rating" => Object {
        "external": "Rating",
        "internal": "default",
        "source": "@material-ui/lab/esm/Rating/index.js",
      },
      "Skeleton" => Object {
        "external": "Skeleton",
        "internal": "default",
        "source": "@material-ui/lab/esm/Skeleton/index.js",
      },
      "SpeedDial" => Object {
        "external": "SpeedDial",
        "internal": "default",
        "source": "@material-ui/lab/esm/SpeedDial/index.js",
      },
      "SpeedDialAction" => Object {
        "external": "SpeedDialAction",
        "internal": "default",
        "source": "@material-ui/lab/esm/SpeedDialAction/index.js",
      },
      "SpeedDialIcon" => Object {
        "external": "SpeedDialIcon",
        "internal": "default",
        "source": "@material-ui/lab/esm/SpeedDialIcon/index.js",
      },
      "TabContext" => Object {
        "external": "TabContext",
        "internal": "default",
        "source": "@material-ui/lab/esm/TabContext/index.js",
      },
      "TabList" => Object {
        "external": "TabList",
        "internal": "default",
        "source": "@material-ui/lab/esm/TabList/index.js",
      },
      "TabPanel" => Object {
        "external": "TabPanel",
        "internal": "default",
        "source": "@material-ui/lab/esm/TabPanel/index.js",
      },
      "Timeline" => Object {
        "external": "Timeline",
        "internal": "default",
        "source": "@material-ui/lab/esm/Timeline/index.js",
      },
      "TimelineConnector" => Object {
        "external": "TimelineConnector",
        "internal": "default",
        "source": "@material-ui/lab/esm/TimelineConnector/index.js",
      },
      "TimelineContent" => Object {
        "external": "TimelineContent",
        "internal": "default",
        "source": "@material-ui/lab/esm/TimelineContent/index.js",
      },
      "TimelineDot" => Object {
        "external": "TimelineDot",
        "internal": "default",
        "source": "@material-ui/lab/esm/TimelineDot/index.js",
      },
      "TimelineItem" => Object {
        "external": "TimelineItem",
        "internal": "default",
        "source": "@material-ui/lab/esm/TimelineItem/index.js",
      },
      "TimelineOppositeContent" => Object {
        "external": "TimelineOppositeContent",
        "internal": "default",
        "source": "@material-ui/lab/esm/TimelineOppositeContent/index.js",
      },
      "TimelineSeparator" => Object {
        "external": "TimelineSeparator",
        "internal": "default",
        "source": "@material-ui/lab/esm/TimelineSeparator/index.js",
      },
      "ToggleButton" => Object {
        "external": "ToggleButton",
        "internal": "default",
        "source": "@material-ui/lab/esm/ToggleButton/index.js",
      },
      "ToggleButtonGroup" => Object {
        "external": "ToggleButtonGroup",
        "internal": "default",
        "source": "@material-ui/lab/esm/ToggleButtonGroup/index.js",
      },
      "TreeItem" => Object {
        "external": "TreeItem",
        "internal": "default",
        "source": "@material-ui/lab/esm/TreeItem/index.js",
      },
      "TreeView" => Object {
        "external": "TreeView",
        "internal": "default",
        "source": "@material-ui/lab/esm/TreeView/index.js",
      },
      "useAutocomplete" => Object {
        "external": "useAutocomplete",
        "internal": "default",
        "source": "@material-ui/lab/esm/useAutocomplete/index.js",
      },
    }
  `);
});
