import PropTypes from "prop-types";
import Button from "./Button";
import { useLocation } from "react-router-dom";

const Header = ({ title, onAdd, showAdd }) => {
  const location = useLocation();

  // Call method from parent to show or hide the 'Add task' panel
  const onClick = (e) => {
    onAdd();
  };

  return (
    <header>
      <h1 className="header">
        {title}{" "}
        {location.pathname === "/" && (
          <Button
            onClick={onClick}
            color={showAdd ? "red" : "green"}
            text={showAdd ? "Close" : "Add"}
          />
        )}
      </h1>
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  onAdd: PropTypes.func,
  showAdd: PropTypes.bool,
};

Header.defaultProps = {
  title: "Hello default tracker",
};

export default Header;
