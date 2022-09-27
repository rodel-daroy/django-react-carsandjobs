import { useEffect, useRef, useState } from 'react';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

const useElementSize = () => {
	const [elementRef, setElementRef] = useState(null);
	const resizeSensor = useRef(null);

	const [size, setSize] = useState({});

	useEffect(() => {
		if(elementRef) {
			const handleResize = () => {
				setSize({
					width: elementRef.clientWidth,
					height: elementRef.clientHeight
				});
			};

			resizeSensor.current = new ResizeSensor(elementRef, handleResize);
			handleResize();
		}

		return () => {
			if(resizeSensor.current)
				resizeSensor.current.detach();
		};
	}, [elementRef]);

	return {
		size,
		ref: setElementRef
	};
};

export default useElementSize;