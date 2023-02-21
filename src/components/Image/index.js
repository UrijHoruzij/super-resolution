import classnames from 'classnames';
import { Spinner } from '../';
import styles from './Image.module.css';

const ImageWrapper = (props) => {
	const { image, size, progress, percent } = props;
	const imageStyle = {
		maxWidth: `${size}px`,
		maxHeight: `${size}px`,
	};
	return (
		<div className={styles.wrapper}>
			<div
				className={classnames({
					[styles.blur]: progress,
				})}>
				<img style={imageStyle} className={styles.image} src={image} alt="" />
			</div>
			{progress && (
				<div className={styles.loader}>
					<Spinner />
					<div className={styles.percent}>{percent.toFixed(0)}%</div>
				</div>
			)}
		</div>
	);
};
export default ImageWrapper;
