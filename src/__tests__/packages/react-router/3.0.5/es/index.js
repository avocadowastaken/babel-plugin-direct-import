/* components */
import _Router from './Router';
import _Link from './Link';
import _IndexLink from './IndexLink';
import _withRouter from './withRouter';

/* components (configuration) */

import _IndexRedirect from './IndexRedirect';
import _IndexRoute from './IndexRoute';
import _Redirect from './Redirect';
import _Route from './Route';
import _RouterContext from './RouterContext';
import _match from './match';
import _useRouterHistory from './useRouterHistory';
import _applyRouterMiddleware from './applyRouterMiddleware';

/* histories */

import _browserHistory from './browserHistory';
import _hashHistory from './hashHistory';
import _createMemoryHistory from './createMemoryHistory';
export { _Router as Router };
export { _Link as Link };
export { _IndexLink as IndexLink };
export { _withRouter as withRouter };
export { _IndexRedirect as IndexRedirect };
export { _IndexRoute as IndexRoute };
export { _Redirect as Redirect };
export { _Route as Route };

/* utils */

export { createRoutes } from './RouteUtils';
export { _RouterContext as RouterContext };

export { locationShape, routerShape } from './PropTypes';
export { _match as match };
export { _useRouterHistory as useRouterHistory };

export { formatPattern } from './PatternUtils';
export { _applyRouterMiddleware as applyRouterMiddleware };
export { _browserHistory as browserHistory };
export { _hashHistory as hashHistory };
export { _createMemoryHistory as createMemoryHistory };
