import { getConfigExports } from '../../../utils/getConfigExports';

it('resolves exports for `@material-ui/core`', () => {
  expect(getConfigExports({ name: '@material-ui/core' }))
    .toMatchInlineSnapshot(`
    Map {
      "colors" => Object {
        "external": "colors",
        "internal": "*",
        "source": "@material-ui/core/esm/colors/index.js",
      },
      "createMuiTheme" => Object {
        "external": "createMuiTheme",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/createMuiTheme.js",
      },
      "unstable_createMuiStrictModeTheme" => Object {
        "external": "unstable_createMuiStrictModeTheme",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/createMuiStrictModeTheme.js",
      },
      "createStyles" => Object {
        "external": "createStyles",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/createStyles.js",
      },
      "makeStyles" => Object {
        "external": "makeStyles",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/makeStyles.js",
      },
      "responsiveFontSizes" => Object {
        "external": "responsiveFontSizes",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/responsiveFontSizes.js",
      },
      "styled" => Object {
        "external": "styled",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/styled.js",
      },
      "useTheme" => Object {
        "external": "useTheme",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/useTheme.js",
      },
      "withStyles" => Object {
        "external": "withStyles",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/withStyles.js",
      },
      "withTheme" => Object {
        "external": "withTheme",
        "internal": "default",
        "source": "@material-ui/core/esm/styles/withTheme.js",
      },
      "createGenerateClassName" => Object {
        "external": "createGenerateClassName",
        "internal": "createGenerateClassName",
        "source": "@material-ui/styles/esm/index.js",
      },
      "jssPreset" => Object {
        "external": "jssPreset",
        "internal": "jssPreset",
        "source": "@material-ui/styles/esm/index.js",
      },
      "ServerStyleSheets" => Object {
        "external": "ServerStyleSheets",
        "internal": "ServerStyleSheets",
        "source": "@material-ui/styles/esm/index.js",
      },
      "StylesProvider" => Object {
        "external": "StylesProvider",
        "internal": "StylesProvider",
        "source": "@material-ui/styles/esm/index.js",
      },
      "MuiThemeProvider" => Object {
        "external": "MuiThemeProvider",
        "internal": "ThemeProvider",
        "source": "@material-ui/styles/esm/index.js",
      },
      "ThemeProvider" => Object {
        "external": "ThemeProvider",
        "internal": "ThemeProvider",
        "source": "@material-ui/styles/esm/index.js",
      },
      "capitalize" => Object {
        "external": "capitalize",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/capitalize.js",
      },
      "createChainedFunction" => Object {
        "external": "createChainedFunction",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/createChainedFunction.js",
      },
      "createSvgIcon" => Object {
        "external": "createSvgIcon",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/createSvgIcon.js",
      },
      "debounce" => Object {
        "external": "debounce",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/debounce.js",
      },
      "deprecatedPropType" => Object {
        "external": "deprecatedPropType",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/deprecatedPropType.js",
      },
      "isMuiElement" => Object {
        "external": "isMuiElement",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/isMuiElement.js",
      },
      "ownerDocument" => Object {
        "external": "ownerDocument",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/ownerDocument.js",
      },
      "ownerWindow" => Object {
        "external": "ownerWindow",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/ownerWindow.js",
      },
      "requirePropFactory" => Object {
        "external": "requirePropFactory",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/requirePropFactory.js",
      },
      "setRef" => Object {
        "external": "setRef",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/setRef.js",
      },
      "unsupportedProp" => Object {
        "external": "unsupportedProp",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/unsupportedProp.js",
      },
      "useControlled" => Object {
        "external": "useControlled",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/useControlled.js",
      },
      "useEventCallback" => Object {
        "external": "useEventCallback",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/useEventCallback.js",
      },
      "useForkRef" => Object {
        "external": "useForkRef",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/useForkRef.js",
      },
      "unstable_useId" => Object {
        "external": "unstable_useId",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/unstable_useId.js",
      },
      "useIsFocusVisible" => Object {
        "external": "useIsFocusVisible",
        "internal": "default",
        "source": "@material-ui/core/esm/utils/useIsFocusVisible.js",
      },
      "Accordion" => Object {
        "external": "Accordion",
        "internal": "default",
        "source": "@material-ui/core/esm/Accordion/index.js",
      },
      "default" => Object {
        "external": "default",
        "internal": "default",
        "source": "@material-ui/core/esm/Zoom/Zoom.js",
      },
      "AccordionActions" => Object {
        "external": "AccordionActions",
        "internal": "default",
        "source": "@material-ui/core/esm/AccordionActions/index.js",
      },
      "AccordionDetails" => Object {
        "external": "AccordionDetails",
        "internal": "default",
        "source": "@material-ui/core/esm/AccordionDetails/index.js",
      },
      "AccordionSummary" => Object {
        "external": "AccordionSummary",
        "internal": "default",
        "source": "@material-ui/core/esm/AccordionSummary/index.js",
      },
      "AppBar" => Object {
        "external": "AppBar",
        "internal": "default",
        "source": "@material-ui/core/esm/AppBar/index.js",
      },
      "Avatar" => Object {
        "external": "Avatar",
        "internal": "default",
        "source": "@material-ui/core/esm/Avatar/index.js",
      },
      "Backdrop" => Object {
        "external": "Backdrop",
        "internal": "default",
        "source": "@material-ui/core/esm/Backdrop/index.js",
      },
      "Badge" => Object {
        "external": "Badge",
        "internal": "default",
        "source": "@material-ui/core/esm/Badge/index.js",
      },
      "BottomNavigation" => Object {
        "external": "BottomNavigation",
        "internal": "default",
        "source": "@material-ui/core/esm/BottomNavigation/index.js",
      },
      "BottomNavigationAction" => Object {
        "external": "BottomNavigationAction",
        "internal": "default",
        "source": "@material-ui/core/esm/BottomNavigationAction/index.js",
      },
      "Box" => Object {
        "external": "Box",
        "internal": "default",
        "source": "@material-ui/core/esm/Box/index.js",
      },
      "styleFunction" => Object {
        "external": "styleFunction",
        "internal": "styleFunction",
        "source": "@material-ui/core/esm/Box/Box.js",
      },
      "Breadcrumbs" => Object {
        "external": "Breadcrumbs",
        "internal": "default",
        "source": "@material-ui/core/esm/Breadcrumbs/index.js",
      },
      "Button" => Object {
        "external": "Button",
        "internal": "default",
        "source": "@material-ui/core/esm/Button/index.js",
      },
      "ButtonBase" => Object {
        "external": "ButtonBase",
        "internal": "default",
        "source": "@material-ui/core/esm/ButtonBase/index.js",
      },
      "ButtonGroup" => Object {
        "external": "ButtonGroup",
        "internal": "default",
        "source": "@material-ui/core/esm/ButtonGroup/index.js",
      },
      "Card" => Object {
        "external": "Card",
        "internal": "default",
        "source": "@material-ui/core/esm/Card/index.js",
      },
      "CardActionArea" => Object {
        "external": "CardActionArea",
        "internal": "default",
        "source": "@material-ui/core/esm/CardActionArea/index.js",
      },
      "CardActions" => Object {
        "external": "CardActions",
        "internal": "default",
        "source": "@material-ui/core/esm/CardActions/index.js",
      },
      "CardContent" => Object {
        "external": "CardContent",
        "internal": "default",
        "source": "@material-ui/core/esm/CardContent/index.js",
      },
      "CardHeader" => Object {
        "external": "CardHeader",
        "internal": "default",
        "source": "@material-ui/core/esm/CardHeader/index.js",
      },
      "CardMedia" => Object {
        "external": "CardMedia",
        "internal": "default",
        "source": "@material-ui/core/esm/CardMedia/index.js",
      },
      "Checkbox" => Object {
        "external": "Checkbox",
        "internal": "default",
        "source": "@material-ui/core/esm/Checkbox/index.js",
      },
      "Chip" => Object {
        "external": "Chip",
        "internal": "default",
        "source": "@material-ui/core/esm/Chip/index.js",
      },
      "CircularProgress" => Object {
        "external": "CircularProgress",
        "internal": "default",
        "source": "@material-ui/core/esm/CircularProgress/index.js",
      },
      "ClickAwayListener" => Object {
        "external": "ClickAwayListener",
        "internal": "default",
        "source": "@material-ui/core/esm/ClickAwayListener/index.js",
      },
      "Collapse" => Object {
        "external": "Collapse",
        "internal": "default",
        "source": "@material-ui/core/esm/Collapse/index.js",
      },
      "Container" => Object {
        "external": "Container",
        "internal": "default",
        "source": "@material-ui/core/esm/Container/index.js",
      },
      "CssBaseline" => Object {
        "external": "CssBaseline",
        "internal": "default",
        "source": "@material-ui/core/esm/CssBaseline/index.js",
      },
      "Dialog" => Object {
        "external": "Dialog",
        "internal": "default",
        "source": "@material-ui/core/esm/Dialog/index.js",
      },
      "DialogActions" => Object {
        "external": "DialogActions",
        "internal": "default",
        "source": "@material-ui/core/esm/DialogActions/index.js",
      },
      "DialogContent" => Object {
        "external": "DialogContent",
        "internal": "default",
        "source": "@material-ui/core/esm/DialogContent/index.js",
      },
      "DialogContentText" => Object {
        "external": "DialogContentText",
        "internal": "default",
        "source": "@material-ui/core/esm/DialogContentText/index.js",
      },
      "DialogTitle" => Object {
        "external": "DialogTitle",
        "internal": "default",
        "source": "@material-ui/core/esm/DialogTitle/index.js",
      },
      "Divider" => Object {
        "external": "Divider",
        "internal": "default",
        "source": "@material-ui/core/esm/Divider/index.js",
      },
      "Drawer" => Object {
        "external": "Drawer",
        "internal": "default",
        "source": "@material-ui/core/esm/Drawer/index.js",
      },
      "ExpansionPanel" => Object {
        "external": "ExpansionPanel",
        "internal": "default",
        "source": "@material-ui/core/esm/ExpansionPanel/index.js",
      },
      "ExpansionPanelActions" => Object {
        "external": "ExpansionPanelActions",
        "internal": "default",
        "source": "@material-ui/core/esm/ExpansionPanelActions/index.js",
      },
      "ExpansionPanelDetails" => Object {
        "external": "ExpansionPanelDetails",
        "internal": "default",
        "source": "@material-ui/core/esm/ExpansionPanelDetails/index.js",
      },
      "ExpansionPanelSummary" => Object {
        "external": "ExpansionPanelSummary",
        "internal": "default",
        "source": "@material-ui/core/esm/ExpansionPanelSummary/index.js",
      },
      "Fab" => Object {
        "external": "Fab",
        "internal": "default",
        "source": "@material-ui/core/esm/Fab/index.js",
      },
      "Fade" => Object {
        "external": "Fade",
        "internal": "default",
        "source": "@material-ui/core/esm/Fade/index.js",
      },
      "FilledInput" => Object {
        "external": "FilledInput",
        "internal": "default",
        "source": "@material-ui/core/esm/FilledInput/index.js",
      },
      "FormControl" => Object {
        "external": "FormControl",
        "internal": "default",
        "source": "@material-ui/core/esm/FormControl/index.js",
      },
      "useFormControl" => Object {
        "external": "useFormControl",
        "internal": "default",
        "source": "@material-ui/core/esm/FormControl/useFormControl.js",
      },
      "FormControlLabel" => Object {
        "external": "FormControlLabel",
        "internal": "default",
        "source": "@material-ui/core/esm/FormControlLabel/index.js",
      },
      "FormGroup" => Object {
        "external": "FormGroup",
        "internal": "default",
        "source": "@material-ui/core/esm/FormGroup/index.js",
      },
      "FormHelperText" => Object {
        "external": "FormHelperText",
        "internal": "default",
        "source": "@material-ui/core/esm/FormHelperText/index.js",
      },
      "FormLabel" => Object {
        "external": "FormLabel",
        "internal": "default",
        "source": "@material-ui/core/esm/FormLabel/index.js",
      },
      "Grid" => Object {
        "external": "Grid",
        "internal": "default",
        "source": "@material-ui/core/esm/Grid/index.js",
      },
      "GridList" => Object {
        "external": "GridList",
        "internal": "default",
        "source": "@material-ui/core/esm/GridList/index.js",
      },
      "GridListTile" => Object {
        "external": "GridListTile",
        "internal": "default",
        "source": "@material-ui/core/esm/GridListTile/index.js",
      },
      "GridListTileBar" => Object {
        "external": "GridListTileBar",
        "internal": "default",
        "source": "@material-ui/core/esm/GridListTileBar/index.js",
      },
      "Grow" => Object {
        "external": "Grow",
        "internal": "default",
        "source": "@material-ui/core/esm/Grow/index.js",
      },
      "Hidden" => Object {
        "external": "Hidden",
        "internal": "default",
        "source": "@material-ui/core/esm/Hidden/index.js",
      },
      "Icon" => Object {
        "external": "Icon",
        "internal": "default",
        "source": "@material-ui/core/esm/Icon/index.js",
      },
      "IconButton" => Object {
        "external": "IconButton",
        "internal": "default",
        "source": "@material-ui/core/esm/IconButton/index.js",
      },
      "Input" => Object {
        "external": "Input",
        "internal": "default",
        "source": "@material-ui/core/esm/Input/index.js",
      },
      "InputAdornment" => Object {
        "external": "InputAdornment",
        "internal": "default",
        "source": "@material-ui/core/esm/InputAdornment/index.js",
      },
      "InputBase" => Object {
        "external": "InputBase",
        "internal": "default",
        "source": "@material-ui/core/esm/InputBase/index.js",
      },
      "InputLabel" => Object {
        "external": "InputLabel",
        "internal": "default",
        "source": "@material-ui/core/esm/InputLabel/index.js",
      },
      "LinearProgress" => Object {
        "external": "LinearProgress",
        "internal": "default",
        "source": "@material-ui/core/esm/LinearProgress/index.js",
      },
      "Link" => Object {
        "external": "Link",
        "internal": "default",
        "source": "@material-ui/core/esm/Link/index.js",
      },
      "List" => Object {
        "external": "List",
        "internal": "default",
        "source": "@material-ui/core/esm/List/index.js",
      },
      "ListItem" => Object {
        "external": "ListItem",
        "internal": "default",
        "source": "@material-ui/core/esm/ListItem/index.js",
      },
      "ListItemAvatar" => Object {
        "external": "ListItemAvatar",
        "internal": "default",
        "source": "@material-ui/core/esm/ListItemAvatar/index.js",
      },
      "ListItemIcon" => Object {
        "external": "ListItemIcon",
        "internal": "default",
        "source": "@material-ui/core/esm/ListItemIcon/index.js",
      },
      "ListItemSecondaryAction" => Object {
        "external": "ListItemSecondaryAction",
        "internal": "default",
        "source": "@material-ui/core/esm/ListItemSecondaryAction/index.js",
      },
      "ListItemText" => Object {
        "external": "ListItemText",
        "internal": "default",
        "source": "@material-ui/core/esm/ListItemText/index.js",
      },
      "ListSubheader" => Object {
        "external": "ListSubheader",
        "internal": "default",
        "source": "@material-ui/core/esm/ListSubheader/index.js",
      },
      "Menu" => Object {
        "external": "Menu",
        "internal": "default",
        "source": "@material-ui/core/esm/Menu/index.js",
      },
      "MenuItem" => Object {
        "external": "MenuItem",
        "internal": "default",
        "source": "@material-ui/core/esm/MenuItem/index.js",
      },
      "MenuList" => Object {
        "external": "MenuList",
        "internal": "default",
        "source": "@material-ui/core/esm/MenuList/index.js",
      },
      "MobileStepper" => Object {
        "external": "MobileStepper",
        "internal": "default",
        "source": "@material-ui/core/esm/MobileStepper/index.js",
      },
      "Modal" => Object {
        "external": "Modal",
        "internal": "default",
        "source": "@material-ui/core/esm/Modal/index.js",
      },
      "ModalManager" => Object {
        "external": "ModalManager",
        "internal": "default",
        "source": "@material-ui/core/esm/Modal/ModalManager.js",
      },
      "NativeSelect" => Object {
        "external": "NativeSelect",
        "internal": "default",
        "source": "@material-ui/core/esm/NativeSelect/index.js",
      },
      "NoSsr" => Object {
        "external": "NoSsr",
        "internal": "default",
        "source": "@material-ui/core/esm/NoSsr/index.js",
      },
      "OutlinedInput" => Object {
        "external": "OutlinedInput",
        "internal": "default",
        "source": "@material-ui/core/esm/OutlinedInput/index.js",
      },
      "Paper" => Object {
        "external": "Paper",
        "internal": "default",
        "source": "@material-ui/core/esm/Paper/index.js",
      },
      "Popover" => Object {
        "external": "Popover",
        "internal": "default",
        "source": "@material-ui/core/esm/Popover/index.js",
      },
      "Popper" => Object {
        "external": "Popper",
        "internal": "default",
        "source": "@material-ui/core/esm/Popper/index.js",
      },
      "Portal" => Object {
        "external": "Portal",
        "internal": "default",
        "source": "@material-ui/core/esm/Portal/index.js",
      },
      "Radio" => Object {
        "external": "Radio",
        "internal": "default",
        "source": "@material-ui/core/esm/Radio/index.js",
      },
      "RadioGroup" => Object {
        "external": "RadioGroup",
        "internal": "default",
        "source": "@material-ui/core/esm/RadioGroup/index.js",
      },
      "useRadioGroup" => Object {
        "external": "useRadioGroup",
        "internal": "default",
        "source": "@material-ui/core/esm/RadioGroup/useRadioGroup.js",
      },
      "RootRef" => Object {
        "external": "RootRef",
        "internal": "default",
        "source": "@material-ui/core/esm/RootRef/index.js",
      },
      "Select" => Object {
        "external": "Select",
        "internal": "default",
        "source": "@material-ui/core/esm/Select/index.js",
      },
      "Slide" => Object {
        "external": "Slide",
        "internal": "default",
        "source": "@material-ui/core/esm/Slide/index.js",
      },
      "Slider" => Object {
        "external": "Slider",
        "internal": "default",
        "source": "@material-ui/core/esm/Slider/index.js",
      },
      "Snackbar" => Object {
        "external": "Snackbar",
        "internal": "default",
        "source": "@material-ui/core/esm/Snackbar/index.js",
      },
      "SnackbarContent" => Object {
        "external": "SnackbarContent",
        "internal": "default",
        "source": "@material-ui/core/esm/SnackbarContent/index.js",
      },
      "Step" => Object {
        "external": "Step",
        "internal": "default",
        "source": "@material-ui/core/esm/Step/index.js",
      },
      "StepButton" => Object {
        "external": "StepButton",
        "internal": "default",
        "source": "@material-ui/core/esm/StepButton/index.js",
      },
      "StepConnector" => Object {
        "external": "StepConnector",
        "internal": "default",
        "source": "@material-ui/core/esm/StepConnector/index.js",
      },
      "StepContent" => Object {
        "external": "StepContent",
        "internal": "default",
        "source": "@material-ui/core/esm/StepContent/index.js",
      },
      "StepIcon" => Object {
        "external": "StepIcon",
        "internal": "default",
        "source": "@material-ui/core/esm/StepIcon/index.js",
      },
      "StepLabel" => Object {
        "external": "StepLabel",
        "internal": "default",
        "source": "@material-ui/core/esm/StepLabel/index.js",
      },
      "Stepper" => Object {
        "external": "Stepper",
        "internal": "default",
        "source": "@material-ui/core/esm/Stepper/index.js",
      },
      "SvgIcon" => Object {
        "external": "SvgIcon",
        "internal": "default",
        "source": "@material-ui/core/esm/SvgIcon/index.js",
      },
      "SwipeableDrawer" => Object {
        "external": "SwipeableDrawer",
        "internal": "default",
        "source": "@material-ui/core/esm/SwipeableDrawer/index.js",
      },
      "Switch" => Object {
        "external": "Switch",
        "internal": "default",
        "source": "@material-ui/core/esm/Switch/index.js",
      },
      "Tab" => Object {
        "external": "Tab",
        "internal": "default",
        "source": "@material-ui/core/esm/Tab/index.js",
      },
      "Table" => Object {
        "external": "Table",
        "internal": "default",
        "source": "@material-ui/core/esm/Table/index.js",
      },
      "TableBody" => Object {
        "external": "TableBody",
        "internal": "default",
        "source": "@material-ui/core/esm/TableBody/index.js",
      },
      "TableCell" => Object {
        "external": "TableCell",
        "internal": "default",
        "source": "@material-ui/core/esm/TableCell/index.js",
      },
      "TableContainer" => Object {
        "external": "TableContainer",
        "internal": "default",
        "source": "@material-ui/core/esm/TableContainer/index.js",
      },
      "TableFooter" => Object {
        "external": "TableFooter",
        "internal": "default",
        "source": "@material-ui/core/esm/TableFooter/index.js",
      },
      "TableHead" => Object {
        "external": "TableHead",
        "internal": "default",
        "source": "@material-ui/core/esm/TableHead/index.js",
      },
      "TablePagination" => Object {
        "external": "TablePagination",
        "internal": "default",
        "source": "@material-ui/core/esm/TablePagination/index.js",
      },
      "TableRow" => Object {
        "external": "TableRow",
        "internal": "default",
        "source": "@material-ui/core/esm/TableRow/index.js",
      },
      "TableSortLabel" => Object {
        "external": "TableSortLabel",
        "internal": "default",
        "source": "@material-ui/core/esm/TableSortLabel/index.js",
      },
      "Tabs" => Object {
        "external": "Tabs",
        "internal": "default",
        "source": "@material-ui/core/esm/Tabs/index.js",
      },
      "TabScrollButton" => Object {
        "external": "TabScrollButton",
        "internal": "default",
        "source": "@material-ui/core/esm/TabScrollButton/index.js",
      },
      "TextField" => Object {
        "external": "TextField",
        "internal": "default",
        "source": "@material-ui/core/esm/TextField/index.js",
      },
      "TextareaAutosize" => Object {
        "external": "TextareaAutosize",
        "internal": "default",
        "source": "@material-ui/core/esm/TextareaAutosize/index.js",
      },
      "Toolbar" => Object {
        "external": "Toolbar",
        "internal": "default",
        "source": "@material-ui/core/esm/Toolbar/index.js",
      },
      "Tooltip" => Object {
        "external": "Tooltip",
        "internal": "default",
        "source": "@material-ui/core/esm/Tooltip/index.js",
      },
      "Typography" => Object {
        "external": "Typography",
        "internal": "default",
        "source": "@material-ui/core/esm/Typography/index.js",
      },
      "Unstable_TrapFocus" => Object {
        "external": "Unstable_TrapFocus",
        "internal": "default",
        "source": "@material-ui/core/esm/Unstable_TrapFocus/index.js",
      },
      "useMediaQuery" => Object {
        "external": "useMediaQuery",
        "internal": "default",
        "source": "@material-ui/core/esm/useMediaQuery/index.js",
      },
      "useScrollTrigger" => Object {
        "external": "useScrollTrigger",
        "internal": "default",
        "source": "@material-ui/core/esm/useScrollTrigger/index.js",
      },
      "withMobileDialog" => Object {
        "external": "withMobileDialog",
        "internal": "default",
        "source": "@material-ui/core/esm/withMobileDialog/index.js",
      },
      "withWidth" => Object {
        "external": "withWidth",
        "internal": "default",
        "source": "@material-ui/core/esm/withWidth/index.js",
      },
      "Zoom" => Object {
        "external": "Zoom",
        "internal": "default",
        "source": "@material-ui/core/esm/Zoom/index.js",
      },
    }
  `);
});
