import React, {useEffect, useState} from 'react'
import classNames from 'classnames'

import {Logo} from './TopNavigation/Logo'
import {Burger} from './TopNavigation/Burger'
import {List} from './TopNavigation/List'

import styles from './TopNavigation/style.module.scss'

export interface MenuElement {
    title: string
    link: string
    className?: string
}

const TopMenu: MenuElement[] = [
    {link: '/about-us', title: 'why us'},
    {link: '/what-we-offer', title: 'what we do'},
    {link: '/projects', title: 'case studies'},
    {link: '/career', title: 'career'},
    {link: '/blog', title: 'blog'},
    {link: '/start-project', title: 'estimate project', className: classNames('is-primary', styles.estimate)},
]

type Props = {
    path?: string
    toggled: (value: boolean) => void
}

export const TopNavigation: React.FC<Props> = ({path, toggled}) => {
    const [menuOpened, setMenuOpened] = useState(false)
    const [isScrolledDown, setIsScrolledDown] = useState(false)

    useEffect(() => {
        document.addEventListener('scroll', () => {
            if (window.scrollY > 10 && !isScrolledDown) {
                setIsScrolledDown(true)
            } else {
                setIsScrolledDown(false)
            }
        })
    }, [])

    const toggleMenu = () => {
        const newValue = !menuOpened
        setMenuOpened(newValue)
        toggled(newValue)
    }

    return (
        <nav className={classNames('navbar is-fixed-top', styles.container, {[styles.hasShadow]: isScrolledDown})}
             role='navigation'
             aria-label='main navigation'>
            <Logo />
            <Burger opened={menuOpened} toggle={toggleMenu} />
            <List opened={menuOpened} elements={TopMenu} currentPath={path || ''} />
        </nav>
    )
}