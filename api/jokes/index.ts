import { NextApiRequest, NextApiResponse } from 'next';
import { ApiHandler, HttpStatus } from '@api';

export type JokesApiResponse = string;

export const jokesApiHandler: ApiHandler<JokesApiResponse> = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const i = Math.floor(Math.random() * JOKES.length);

  res.statusCode = HttpStatus.OK;
  res.send({ data: JOKES[i] });
};

const JOKES = [
  `Why Can't You Trust Atoms?
  They make up everything.`,

  `I'm Reading a Book on Anti-Gravity
  I can't put it down.`,

  `I Have a New Theory on Inertia
  But it doesn't seem to be going anywhere.`,

  `There Are Two Types of People in the World
  Those who can extrapolate from incomplete data.`,

  `Did You Know There's a Band Called 1023MB?
  They're not bad, but they haven't had any gigs yet.`,

  `Where Does Bad Light End Up?
  In prism.`,

  `Why Does a Burger Have Less Energy Than a Steak?
  Because a burger is in it's ground state.`,

  `Parallel Lines Have So Much in Common
  It's a shame they'll never meet.`,

  `Why Is Beer Never Served at a Math Party?
  Because you can't drink and derive.`,

  `Why Did the Programmer Use the Entire Bottle of Shampoo During One Shower?
  Because the bottle said "Lather, Rinse, Repeat."`,

  `A Photon Is Checking Into a Hotel
  The bellhop asks him, "Do you have any luggage?"
  The photon replies, "Nope, I'm traveling light."`,

  `The rotation of Earth really makes my day.`,

  `A Farmer Counted 196 Cows in the Field
  But when he rounded them up, he had 200.`,
];
