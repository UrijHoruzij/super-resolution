import React, { useContext } from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LangContext } from '../';
import styles from './Sidebar.module.css';

const Sidebar = () => {
	const [messages] = useContext(LangContext);
	const router = useRouter();
	return (
		<div className={styles.sidebar}>
			<div className={styles.sidebar__logo}>
				<div className={styles.sidebar__item_image}>
					<Image layout="fixed" src="/images/logo-big.svg" alt="logo" width={44} height={44} />
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
							<a>
								<div className={styles.sidebar__item_image}>
									<Image layout="fixed" src="/images/image.svg" alt="Picture of the author" width={24} height={24} />
								</div>
								{messages.upscayl.title}
							</a>
						</Link>
					</li>
					{/* <li className={styles.sidebar__item}>
						<Link href="/">
							<a>Испраление</a>
						</Link>
					</li>
					<li className={styles.sidebar__item}>
						<Link href="/">
							<a>Колоризация</a>
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
						<a>
							<div className={styles.sidebar__item_image}>
								<Image
									className={styles.sidebar__item_image}
									layout="fixed"
									src="/images/settings.svg"
									alt="Picture of the author"
									width={24}
									height={24}
								/>
							</div>
							{messages.settings.title}
						</a>
					</Link>
				</li>
				<li
					className={classnames(styles.sidebar__item, {
						[styles.sidebar__itemActiv]: router.pathname == '/help',
					})}>
					<Link href="/help">
						<a>
							<div className={styles.sidebar__item_image}>
								<Image
									className={styles.sidebar__item_image}
									layout="fixed"
									src="/images/help.svg"
									alt="Picture of the author"
									width={24}
									height={24}
								/>
							</div>
							{messages.help.title}
						</a>
					</Link>
				</li>
			</ul>
		</div>
	);
};
export default Sidebar;
