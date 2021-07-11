import React, { FC } from 'react';
import { Page } from '@components/page';
import { HelloWorld, Props as HelloWorldProps } from '@components/hello-world';
import { useIndexPage } from './hooks';

import pixelCatImage from '@assets/images/pixel-cat.png';
import catImage from '@assets/images/cat.jpg';

export type Props = {};

export const IndexPage: FC<Props> = (props) => {
  const {
    count,
    increase,
    decrease,
    locale,
    locales,
    changeLang,
  } = useIndexPage();

  const helloWorldProps: HelloWorldProps = {
    count,
    locale,
    locales,
    onIncrease: increase,
    onDecrease: decrease,
    onLangChang: changeLang,
  };

  const INLINE_IMAGE_WIDTH = 80;
  const FILE_IMAGE_WIDTH = 200;

  const title = `${PACKAGE_NAME} - ${PACKAGE_VERSION} (${COMMIT_HASH_SHORT})`;

  return (
    <Page title={title} header="Index">
      <img
        src={pixelCatImage}
        width={INLINE_IMAGE_WIDTH}
        title="This image is loaded inline"
      />
      <HelloWorld {...helloWorldProps} />
      <img
        src={catImage}
        width={FILE_IMAGE_WIDTH}
        title="This image is loaded from a file"
      />
    </Page>
  );
};
