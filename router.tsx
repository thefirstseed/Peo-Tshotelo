import React, { useState, useEffect, createContext, useContext } from 'react';

// --- Router Context ---
const RouterContext = createContext<{ params: Record<string, string> }>({ params: {} });

const getCurrentPath = () => window.location.hash.slice(1) || '/';

// --- Core Router Component ---
export const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const onHashChange = () => setPath(getCurrentPath());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  let matchedComponent = null;
  let routeParams = {};

  const routes = React.Children.toArray(children) as React.ReactElement<RouteProps>[];
  const defaultRoute = routes.find(route => route.props.default);

  for (const route of routes) {
    if (route.props.path) {
      const paramNames: string[] = [];
      const regexPath = route.props.path.replace(/:\w+/g, (match) => {
        paramNames.push(match.substring(1));
        return '([^/]+)';
      });
      
      const match = path.match(new RegExp(`^${regexPath}$`));
      
      if (match) {
        paramNames.forEach((name, index) => {
          routeParams[name] = match[index + 1];
        });
        matchedComponent = <route.props.component />;
        break;
      }
    }
  }

  if (!matchedComponent && defaultRoute) {
    matchedComponent = <defaultRoute.props.component />;
  }

  return (
    <RouterContext.Provider value={{ params: routeParams }}>
      {matchedComponent}
    </RouterContext.Provider>
  );
};

// --- Route Component ---
interface RouteProps {
  path?: string;
  component: React.ComponentType;
  default?: boolean;
}
export const Route: React.FC<RouteProps> = () => null; // This component only serves as a configuration carrier

// --- Navigation & Hooks ---
export const navigate = (to: string) => {
  window.location.hash = to;
};

export const useParams = () => {
  const { params } = useContext(RouterContext);
  return params;
};