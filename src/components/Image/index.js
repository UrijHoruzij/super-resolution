import { SliderBeforeAfter } from 'ui-forest';
import classnames from 'classnames';
import { Spinner } from '../';
import styles from './Image.module.css';

const Image = (props) => {
	const { after, before, progress, percent } = props;
	return (
		<div className={styles.wrapper}>
			<div
				className={classnames({
					[styles.blur]: progress,
				})}>
				{after ? (
					<SliderBeforeAfter size={250} urlFirstImage={before} urlSecondImage={after}></SliderBeforeAfter>
				) : (
					<SliderBeforeAfter size={250} urlFirstImage={before}></SliderBeforeAfter>
				)}
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
export default Image;
