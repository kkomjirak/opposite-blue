'use client';

import { getImageProps, type ImageLoaderProps, type ImageProps } from 'next/image';
import { preload } from 'react-dom';
import { useState, type Ref } from 'react';
import imageManifest from '../data/portfolio_images.json';

type ManifestImage = {
  width: number;
  height: number;
  bytes: number;
  animated?: boolean;
  variants: { width: number; src: string; bytes: number }[];
};
const manifest: Record<string, ManifestImage> = imageManifest;

export type PortfolioImageProps = Omit<ImageProps, 'src' | 'loader'> & {
  src: string;
  /** Intentional full-resolution/detail use only; ordinary cards stay optimized. */
  fullResolution?: boolean;
  ref?: Ref<HTMLImageElement>;
};

function resolveImage(src: string) {
  // getAssetPath may prepend a deployment basePath. Do not rewrite remote URLs.
  const marker = '/portfolio/images/';
  const index = src.startsWith('/') && !src.startsWith('//') ? src.indexOf(marker) : -1;
  const key = index < 0 ? src : src.slice(index);
  return { image: manifest[key], prefix: index < 0 ? '' : src.slice(0, index) };
}

/** Every URL is an existing derivative, including requests beyond the source width. */
export function portfolioImageLoader({ src, width }: ImageLoaderProps): string {
  const { image, prefix } = resolveImage(src);
  if (!image?.variants.length) return src;
  const variant = image.variants.find((candidate) => candidate.width >= width) ?? image.variants[image.variants.length - 1];
  return `${prefix}${variant.src}`;
}

/** Public Next image API supplies fill styles, dimensions and native image attributes. */
export function getPortfolioImageProps({ src, fullResolution = false, ...options }: PortfolioImageProps) {
  const { image, prefix } = resolveImage(src);
  const optimized = !fullResolution && !options.unoptimized && Boolean(image?.variants.length);
  const dimensions: { width?: number | `${number}`; height?: number | `${number}` } = {};
  if (!options.fill && image) {
    dimensions.width = options.width ?? (options.height ? Math.round(Number(options.height) * image.width / image.height) : image.width);
    dimensions.height = options.height ?? (options.width ? Math.round(Number(options.width) * image.height / image.width) : image.height);
  }
  const { props } = getImageProps({
    ...options,
    ...dimensions,
    src,
    loader: portfolioImageLoader,
    unoptimized: !optimized,
  });
  if (!optimized || !image) return props;

  // Next's default breakpoints don't match capped static files. Use truthful width
  // descriptors instead of labelling e.g. an 800px file "1920w". This also works
  // when the application's older global unoptimized flag is still enabled.
  return {
    ...props,
    sizes: options.sizes ?? (options.width ? `${options.width}px` : '100vw'),
    srcSet: image.variants.map((variant) => `${prefix}${variant.src} ${variant.width}w`).join(', '),
    src: portfolioImageLoader({ src, width: image.variants[image.variants.length - 1].width }),
  };
}

/** Drop-in string-src Image interface backed entirely by static WebP assets. */
export default function PortfolioImage({ ref, onLoad, onLoadingComplete, ...options }: PortfolioImageProps) {
  const [loaded, setLoaded] = useState(false);
  const props = getPortfolioImageProps({ ...options, placeholder: loaded ? 'empty' : options.placeholder });
  if (options.preload || options.priority) {
    preload(props.src, { as: 'image', imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: options.fetchPriority, crossOrigin: options.crossOrigin, referrerPolicy: options.referrerPolicy });
  }
  return (
    // Next's documented getImageProps API plus exact static srcSet, not the server optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} src={props.src} alt={options.alt} ref={ref} onLoad={(event) => {
      setLoaded(true);
      onLoad?.(event);
      onLoadingComplete?.(event.currentTarget);
    }} />
  );
}
