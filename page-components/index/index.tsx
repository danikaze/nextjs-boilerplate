import React, { FC } from 'react';
import { Page } from '@components/page';
import { HelloWorld, Props as HelloWorldProps } from '@components/hello-world';
import pixelCatImage from '@assets/images/pixel-cat.png';
import { useIndexPage } from './hooks';

import catImage from '@assets/images/cat.jpg';

export type Props = {};

export const IndexPage: FC<Props> = () => {
  const {
    count,
    increase,
    decrease,
    currentLang,
    langList,
    changeLang,
  } = useIndexPage();

  const props: HelloWorldProps = {
    count,
    currentLang,
    langList,
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
      <HelloWorld {...props} />
      <img
        src={catImage}
        width={FILE_IMAGE_WIDTH}
        title="This image is loaded from a file"
      />
    </Page>
  );
};
