import { Avatar as AntAvatar } from "antd";
import PropTypes from "prop-types";

import { colors } from "../../../lib/colors";

const Avatar = ({ user }) => {
  let avatarText = user.email[0];
  const [firstName, lastName] = user.name.split(" ");
  if (firstName && lastName) {
    avatarText = firstName[0] + lastName[0];
  }

  return (
    <AntAvatar
      style={{
        backgroundColor: colors.orange[5]
      }}
    >
      {avatarText.toUpperCase()}
    </AntAvatar>
  );
};
Avatar.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })
};

export default Avatar;
