import React, { useState } from 'react'
import navStyles from "./Navbar.module.css"

// redux
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/src/features/userSlice'

// hooks
import useWindowDimensions from '@/src/hooks/useWindowDimensions'
// animations 
import { motion, AnimatePresence } from "framer-motion"
import { appConstants } from '@/src/constants/appConstants'

// icons
import { BiExit } from "react-icons/bi";
import { RootState } from '@/src/config/reduxStore'

// variants
const mobileNavVariants = {
    initial: {
        top: -280
    },

    animate: {
        top: 0
    }
}

const Navbar = () => {
    const dimensions = useWindowDimensions()
    const [isOpened, setIsOpened] = useState(false)
    const [userMenuOpened, setUserMenuOpened] = useState(false)

    const dispatch = useDispatch()
    const userId = useSelector((state: RootState) => state.user.id)
    console.log(userId)

    if (!userId) return (
        <header className={navStyles.navbar}></header>
    )


    return (
        <header className={navStyles.navbar}>
            <div className={navStyles.user_icon_container} onClick={() => setUserMenuOpened(p => !p)}>
                <img src={`${appConstants.serverUrl}/api/user/icon`} alt="user icon" className={navStyles.user_icon} />
                <div className={navStyles.user_menu} hidden={!userMenuOpened}>
                    <ul>
                        <li onClick={() => dispatch(logout())}><BiExit/>Logout</li>
                    </ul>
                </div>
            </div>
            {dimensions.width < 576 ? <>
                <div className={isOpened ? `${navStyles.hamburger} ${navStyles.opened_hamburger}` : `${navStyles.hamburger} ${navStyles.closed_hamburger}`} onClick={() => setIsOpened(p => !p)}>
                    <div className={isOpened ? `${navStyles.hamburger_icon} ${navStyles.icon_opened}` : `${navStyles.hamburger_icon} ${navStyles.icon_closed}`}></div>
                </div>

                <AnimatePresence>
                    {isOpened ?
                        <motion.ul className={navStyles.mobile_nav} variants={mobileNavVariants} initial="initial" animate="animate" exit="initial">
                            {/* <NavLink url="/" text="Home" />
                            <NavLink url="/contact" text="Contact" />
                            <NavLink url="/projects" text="Projects" />
                            <NavLink url="/skills" text="Skills" /> */}
                        </motion.ul>
                        : null}
                </AnimatePresence>

            </> :
                <div className={navStyles.desktop_nav}>
                    {/* <Link to="/" className='home-link'><img src="/logo.png" alt="logo" className="logo" /></Link> */}
                    <ul>
                        {/* <NavLink url="/contact" text="Contact" />
                        <NavLink url="/projects" text="Projects" />
                        <NavLink url="/skills" text="Skills" /> */}
                    </ul>
                </div>}
        </header >
    )
}

export default Navbar