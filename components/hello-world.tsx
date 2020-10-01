import { FunctionComponent } from 'react';

export interface Props {
  saluteWho?: string;
}

export const HelloWorld: FunctionComponent<Props> = ({ saluteWho }) => {
  return <div>Hello {saluteWho}!</div>;
};

HelloWorld.defaultProps = {
  saluteWho: 'world',
};
