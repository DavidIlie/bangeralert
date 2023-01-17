import * as AuthSession from "expo-auth-session";
import { SigninResult, getSignInInfo } from "next-auth/expo";
import { useAutoDiscovery } from "expo-auth-session";

import { nativeProviders, isValidProvider, getData } from "@acme/auth";

export const useAuth = (baseProvider: keyof typeof nativeProviders) => {
  const data = getData(baseProvider);

  const discovery = data.discoveryUrl
    ? useAutoDiscovery(data.discoveryUrl)
    : data.discovery;

  const funcSignIn = async (): Promise<SigninResult | null> => {
    const proxyRedirectUri = AuthSession.makeRedirectUri({
      useProxy: true,
      scheme: "banger.alert",
    });

    const provider = isValidProvider(baseProvider)
      ? nativeProviders[baseProvider]
      : baseProvider;

    const signinInfo = await getSignInInfo({
      provider,
      proxyRedirectUri,
    });

    if (!signinInfo) {
      throw new Error("Couldn't get sign in info from server");
    }

    const { state, codeChallenge, stateEncrypted, codeVerifier, clientId } =
      signinInfo;

    const request = new AuthSession.AuthRequest({
      clientId: clientId,
      scopes: data.scopes,
      redirectUri: proxyRedirectUri,
      usePKCE: false,
      state: state,
      codeChallenge: codeChallenge,
    });

    await request.makeAuthUrlAsync(discovery as any);

    const result = await request.promptAsync(discovery as any, {
      useProxy: true,
    });

    return {
      result,
      state,
      stateEncrypted,
      codeVerifier,
      provider,
    };
  };

  return funcSignIn;
};
