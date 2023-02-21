import React from 'react';
import classnames from 'classnames';
import styles from './Menu.module.css';

const Menu = (props) => {
	const { menu = [], menuItem = null, changeMenu = () => {} } = props;

	return (
		<nav className={styles.window_menu}>
			<ul className={styles.window_menu_list}>
				{menu.map((item) => (
					<li key={item.id} onClick={() => (item.onClick ? item.onClick() : changeMenu(item.id))}>
						<span className={styles.window_menu_item}>{item.name}</span>
						{item.list && item.list.length > 0 && (
							<div className={classnames(styles.menu, { [styles.menu_show]: menuItem === item.id })}>
								{item.list.map((group, index) => (
									<ul key={index} className={styles.menu_list}>
										{group.map((point) => (
											<li
												key={point.id}
												onClick={point.disabled ? null : point.onClick}
												className={classnames(styles.menu_item, { [styles.menu_item_disabled]: point.disabled })}>
												<span>{point.name}</span>
												<span>{point.shortcut}</span>
												{point.subMenu && point.subMenu.length > 0 && (
													<ul className={styles.menu_sub_list}>
														{point.subMenu.map((subPoint) => (
															<li
																key={subPoint.id}
																onClick={subPoint.disabled ? null : subPoint.onClick}
																className={classnames(styles.menu_item, {
																	[styles.menu_item_disabled]: subPoint.disabled,
																})}>
																<span>{subPoint.name}</span>
																<span>{subPoint.shortcut}</span>
															</li>
														))}
													</ul>
												)}
											</li>
										))}
									</ul>
								))}
							</div>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Menu;
