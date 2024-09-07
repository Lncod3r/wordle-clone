import type { PageLoad } from "./$types";
import { paroleCinqueLettere } from "$lib/words";

export const load = (async () => {
  const word =
    paroleCinqueLettere[Math.floor(Math.random() * paroleCinqueLettere.length)];
  return {word};
}) satisfies PageLoad;
