import React from "react";
import { groupBy, orderBy } from 'lodash';
import { Tooltip } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
export class Menu {
    constructor(menu = []) {
        this.items = getMenu(menu) || [];
    }
}

const getMenu = (menu) => {
    const groups = groupBy(menu, 'parent_menu_id');
    const parents = groups[null]; // grouped by null are parents

    return orderBy(
        parents.map(parentItem => {
            const menuItem = getMenuItem(parentItem);
            const children = groups[parentItem.id];
            if (children) {
                menuItem.content = orderBy(children.map(item => getMenuItem(item)), ['sequence']);
            }

            return menuItem;
        }),
        ['sequence']
    );
};
const LightTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

const getMenuItem = (menuItem) => {
    return {
        id: menuItem.id,
        label: Boolean(menuItem?.module_content) ? (<div key={menuItem.id}>
            <LightTooltip
                title={
                    <div className="p-2 text-dark">
                        <small style={{
                            fontSize: "14px"
                        }}>{menuItem?.module_content}</small>

                    </div>
                }
                placement="top"
            >
                <span>{menuItem.name}</span>
            </LightTooltip>
        </div>) : menuItem.name,
        icon: menuItem.class,
        to: getURL(menuItem.url),
        sequence: menuItem.sequence,
        canRead: menuItem.canread,
        canDelete: menuItem.candelete,
        canWrite: menuItem.canwrite
        // content: [{
        //     id: 55,
        //     label: 'Extra',
        //     icon: 'user',
        //     to: getURL('/home'),
        //     sequence: 1,
        //     canRead: 1,
        //     canDelete: 1,
        //     canWrite: 1,
        // }]
    };
};

const getURL = (url) => {
    if (url === '/userManagement') {
        return '/user_management';
    }
    return url;
};
