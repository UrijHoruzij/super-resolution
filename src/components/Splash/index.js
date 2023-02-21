import Image from 'next/image';
import styles from './Splash.module.css';
import splashImage from '../../../public/images/splash.jpg';
import logo from '../../../public/images/logo-big.svg';

const Splash = (props) => {
	const { messages, version } = props;
	return (
		<div className={styles.splash}>
			<div className={styles.wrapper}>
				<div className={styles.logo}>
					<Image src={logo} priority alt={messages.splash.title} width={72} height={72} />
					<div className={styles.name}>{messages.splash.title}</div>
				</div>
				<div className={styles.copyright}>
					&copy; {new Date().getFullYear()} {messages.splash.author}
					<br />
					{messages.splash.copyright}
				</div>
				<div className={styles.copyright}>{messages.splash.authorImage} Vladimir Fedotov</div>
				<div className={styles.loading}>
					{messages.splash.loading}
					<div className={styles.dots}>
						<div className={styles.dot}>.</div>
						<div className={styles.dot}>.</div>
						<div className={styles.dot}>.</div>
					</div>
				</div>
				<div className={styles.version}>v{version}</div>
			</div>
			<Image className={styles.splashImage} priority src={splashImage} alt="splash" />
		</div>
	);
};
export default Splash;
