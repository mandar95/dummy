/*
 * @desc: To Control Side Menu State [Open/Close]
 */

import React, { useState } from 'react';
const drawerControl = {
    status: false,
    openStatus: () => { },
    closeStatus: () => { },
};

const DrawerContext = React.createContext(drawerControl);
const { Provider: DrawerProvider, Consumer: DrawerConsumer } = DrawerContext;


const DrawerControl = (props) => {

    const [status, setStatus] = useState(false)
    const openStatus = () => {
        setStatus(!status)
    }
    const closeStatus = () => {
        setStatus(false)
    }
    return <DrawerProvider value={{ status, openStatus, closeStatus }}>
        {props.children}
    </DrawerProvider>
}

export { DrawerControl, DrawerProvider, DrawerConsumer, DrawerContext };
