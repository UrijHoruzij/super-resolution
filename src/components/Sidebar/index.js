import React, { useContext } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LangContext } from '../';
import styles from './Sidebar.module.css';

import logo from '../../../public/images/logo-big.svg';
import upscaleImage from '../../../public/images/image.svg';
import settingsImage from '../../../public/images/settings.svg';
import helpImage from '../../../public/images/help.svg';

const Sidebar = () => {
	const [messages] = useContext(LangContext);
	const router = useRouter();
	return (
		<div className={styles.sidebar}>
			<div className={styles.sidebar__logo}>
				<div className={styles.sidebar__item_image}>
					<Image src={logo} alt={messages.home.name} width={44} height={44} />
				</div>
				<div className={styles.sidebar__name}>{messages.home.name}</div>
			</div>
			<nav className={styles.sidebar__menu}>
				<ul className={styles.sidebar__list}>
					<li
						className={classnames(styles.sidebar__item, {
							[styles.sidebar__itemActiv]: router.pathname == '/superResolution',
						})}>
						<Link href="/superResolution">
							<div className={styles.sidebar__item_image}>
								<Image src={upscaleImage} alt={messages.upscayl.title} width={24} height={24} />
							</div>
							{messages.upscayl.title}
						</Link>
					</li>
					{/* <li className={styles.sidebar__item}>
						<Link href="/">
							Испраление
						</Link>
					</li>
					<li className={styles.sidebar__item}>
						<Link href="/">
							Колоризация
						</Link>
					</li> */}
				</ul>
			</nav>
			<ul className={classnames(styles.sidebar__list, styles.sidebar__footer)}>
				<li
					className={classnames(styles.sidebar__item, {
						[styles.sidebar__itemActiv]: router.pathname == '/settings',
					})}>
					<Link href="/settings">
						<div className={styles.sidebar__item_image}>
							<Image
								className={styles.sidebar__item_image}
								src={settingsImage}
								alt={messages.settings.title}
								width={24}
								height={24}
							/>
						</div>
						{messages.settings.title}
					</Link>
				</li>
				<li
					className={classnames(styles.sidebar__item, {
						[styles.sidebar__itemActiv]: router.pathname == '/help',
					})}>
					<Link href="/help">
						<div className={styles.sidebar__item_image}>
							<Image
								className={styles.sidebar__item_image}
								src={helpImage}
								alt={messages.help.title}
								width={24}
								height={24}
							/>
						</div>
						{messages.help.title}
					</Link>
				</li>
			</ul>
		</div>
	);
};
export default Sidebar;
