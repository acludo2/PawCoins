import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserEdit, faTh } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const Menu = ({ visibility, toggleVisibility }) => {

  const handleClick = (index) => {
    const newVisibility = [...visibility];
    newVisibility[index] = !newVisibility[index];
    toggleVisibility(newVisibility);
  };

  return (
    <div className="menu">
      {visibility[0] && (
        <div onClick={() => handleClick(0)}>
          <FontAwesomeIcon icon={faUser} />
          <span>Profile</span>
        </div>
      )}
      {visibility[1] && (
        <div onClick={() => handleClick(1)}>
          <FontAwesomeIcon icon={faUserEdit} />
          <span>Edit Profile</span>
        </div>
      )}
      {visibility[2] && (
        <div onClick={() => handleClick(2)}>
          <FontAwesomeIcon icon={faTh} />
          <span>Wall</span>
        </div>
      )}
    </div>
  );
};

export default Menu;
