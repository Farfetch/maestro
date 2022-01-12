import { Link } from "react-router-dom";

const Breadcrumb = ({ route, routes }) => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? (
    <span>{route.breadcrumbName}</span>
  ) : (
    <Link to={route.path}>{route.breadcrumbName}</Link>
  );
};

export default Breadcrumb;
