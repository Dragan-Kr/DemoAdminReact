import React, { useState } from "react";

import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import News from "../../images/news1.svg";
import Arrow from "../../images/arrow.svg";
import Isvg from "react-inlinesvg";

import {ADD_NEWS, NEWS_LIST} from "../../globalVariables";

function MySideNav({ setElementClass }) {
  const [openMenu, setOpenMenu] = useState(false);

  function openNewsMenu() {
    setOpenMenu(true);
    if (openMenu) {
      setOpenMenu(false);
    }
  }


  return (
    <div className="side-bar">
      <div className="title-mobile-close">
        <h1 className="heading-side-bar">
          demo<span>admin</span>
        </h1>
        <div
          onClick={() => {
            setElementClass((prev) => false);
          }}
        >
          X
        </div>
      </div>
      <div className="side-bar-title" onClick={openNewsMenu}>
        <div>
          <Isvg className="isvg-news" src={News} />
          <span>News </span>
        </div>
        <Isvg
          className={` ${openMenu ? "open-arrow-up" : "open-arrow-down"}`}
          src={Arrow}
        />
      </div>
      {openMenu ? (
        <ul className="ul-links">
          <li>
            <a href={NEWS_LIST}>News List</a>
          </li>
          <li>
            <a href={ADD_NEWS}>Add News</a>
          </li>
        </ul>
      ) : null}
    </div>
  );

}

export default MySideNav;
