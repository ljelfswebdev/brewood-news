// helpers/Image.js
import NextImage from 'next/image';

const FALLBACK_SRC = '/image-coming-soon.png'; // make sure this exists in /public

export default function ImageWithFallback(props) {
  const { src, alt, ...rest } = props;

  const safeSrc =
    typeof src === 'string' && src.trim().length > 0
      ? src
      : FALLBACK_SRC;

  const safeAlt = alt || 'Image';

  return <NextImage src={safeSrc} alt={safeAlt} {...rest} />;
}