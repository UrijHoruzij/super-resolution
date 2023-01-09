import Image from 'next/image';
import styles from './Splash.module.css';

const Splash = (props) => {
	const { messages, version } = props;
	return (
		<div className={styles.splash}>
			<div className={styles.wrapper}>
				<div className={styles.logo}>
					<Image layout="fixed" src="/images/logo-big.svg" alt="logo" width={72} height={72} />
					<div className={styles.name}>{messages.splash.title}</div>
				</div>
				<div className={styles.copyright}>{messages.splash.author} 2023</div>
				<div className={styles.loading}>
					{messages.splash.loading}
					<div className={styles.dots}>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
						<div className={styles.dot}></div>
					</div>
				</div>
				<div className={styles.version}>v{version}</div>
			</div>
			<Image layout="fixed" src="/images/splash.jpg" alt="splash" width={430} height={500} />
		</div>
	);
};
export default Splash;
