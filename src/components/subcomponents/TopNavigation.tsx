import React, { useState } from "react"
import styled from "styled-components"

const NavbarStart = styled.div`
  flex: 1;
`

const NavbarItem = styled.a`
  justify-content: center;
  text-transform: none;
  color: black;
`

export const TopNavigation = () => {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <a className="navbar-item is-expanded" href="/">
            <img
              className="navbar-logo"
              src="/images/bright_inventions_logo_500-01.png"
            />
          </a>

          <a
            role="button"
            className={"navbar-burger burger " + (showMenu ? "is-active" : "")}
            aria-label="menu"
            aria-expanded="false"
            data-target="#topNavBar"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="topNavBar"
          className={"navbar-menu " + (showMenu ? "is-active" : "")}
        >
          <NavbarStart className="navbar-start">
            <NavbarItem className="navbar-item is-expanded" href="/about-us">
              why us
            </NavbarItem>

            <NavbarItem
              className="navbar-item is-expanded"
              href="/what-we-offer"
            >
              what we do
            </NavbarItem>

            <NavbarItem className="navbar-item is-expanded" href="/projects">
              case studies
            </NavbarItem>

            <NavbarItem className="navbar-item is-expanded" href="/career">
              career
            </NavbarItem>

            <NavbarItem className="navbar-item is-expanded" href="/blog">
              blog
            </NavbarItem>
          </NavbarStart>

          <div className="navbar-end is-hidden-mobile">
            <div className="navbar-item">
              <div className="buttons">
                <a className="button is-primary" href="/start-project">
                  <strong>estimate project</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
