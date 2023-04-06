import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { DrawerContext } from '../../context/sidebar.context.api'
import { useMediaPredicate } from "react-media-hook";



const RouterLink = props => {
    // const {to} = props;
    const { closeStatus } = useContext(DrawerContext);
    const biggerThan767 = useMediaPredicate("(min-width: 767px)");
    // useEffect(() => {
    //     if (to && to.length > 0 && to[0] !== '/') {
    //         setTo(prev => `/${this.to}`);
    //     }
    // }, [to]);
    // componentWillMount() {
    //     this.to = this.props.to;
    //     if (this.to[0] !== '/') this.to = `/${this.to}`;

    //     this.props.history.listen(this.onLocationChange.bind(this));
    //     this.onLocationChange(this.context.router.route);
    // }
    
    // const onLocationChange = (e) => {
    //     if ((e.pathname || '/') === this.to) {
    //         this.props.activateMe();
    //     }
    // };

    const _renderLink = () => {
        const {
            className,
            classNameActive,
            classNameHasActiveChild,
            active,
            hasActiveChild,
            to,
            externalLink,
            hasSubMenu,
            toggleSubMenu,
            children,
        } = props;

        return (
            hasSubMenu || externalLink
                ? (
                    <a
                        className={classnames(
                            className,
                            hasActiveChild && classNameHasActiveChild
                        )}
                        target={externalLink ? '_blank' : undefined}
                        href={to}
                        onClick={toggleSubMenu}
                    >
                        {children}
                    </a>
                )
                : (
                    <Link
                        className={classnames(
                            className,
                            active && classNameActive
                        )}
                        to={to}
                        onClick={() => biggerThan767 ? {} : closeStatus()}
                    >
                        {children}
                    </Link>
                )
        );
    };

    return _renderLink();
}

RouterLink.propTypes = {
    className: PropTypes.string.isRequired,
    classNameActive: PropTypes.string.isRequired,
    classNameHasActiveChild: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    hasActiveChild: PropTypes.bool.isRequired,
    to: PropTypes.string.isRequired,
    externalLink: PropTypes.bool,
    hasSubMenu: PropTypes.bool.isRequired,
    toggleSubMenu: PropTypes.func,
    activateMe: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]).isRequired,
};

// RouterLink.contextTypes = {
//     router: PropTypes.object.isRequired,
// };

export default RouterLink;
