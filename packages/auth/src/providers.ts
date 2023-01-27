export const nativeProviders = {
  spotify: "spotify-expo",
} as const;

type validProviderType =
  | { valid: false; counterpart?: undefined }
  | { valid: true; counterpart: string };

export const checkCounterpart = (provider: string): validProviderType => {
  const nextProviders = Object.keys(nativeProviders);
  const expoProviders = Object.values(nativeProviders);

  if (nextProviders.includes(provider)) {
    const index = nextProviders.indexOf(provider);
    return { valid: true, counterpart: expoProviders[index]! };
  }

  if (expoProviders.includes(provider as any)) {
    const index = expoProviders.indexOf(provider as any);
    return { valid: true, counterpart: nextProviders[index]! };
  }

  return { valid: false };
};

export const isValidProvider = (
  k: string,
): k is keyof typeof nativeProviders => {
  return k in nativeProviders;
};

type ProviderType =
  | {
      discovery: {
        authorizationEndpoint: string;
        tokenEndpoint: string;
        revokeEndpoint?: string;
      };
      discoveryUrl?: never;
      scopes: string[];
    }
  | {
      discoveryUrl: string;
      discovery?: never;
      scopes: string[];
    };

export const getData = (provider: keyof typeof nativeProviders): ProviderType =>
  ({
    spotify: {
      discovery: {
        authorizationEndpoint: "https://accounts.spotify.com/authorize",
        tokenEndpoint: "https://accounts.spotify.com/api/token",
      },
      scopes: [
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-top-read",
        "user-read-recently-played",
        "user-library-read",
        "user-read-playback-state",
        "user-read-currently-playing",
        "user-modify-playback-state",
      ],
    },
  }[provider]);
