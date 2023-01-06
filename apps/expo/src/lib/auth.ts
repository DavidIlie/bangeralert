import * as AuthSession from "expo-auth-session";
import { SigninResult, getSignInInfo } from "next-auth/expo";
import { useAutoDiscovery } from "expo-auth-session";

import { nativeProviders, isValidProvider, getData } from "@app/server";

export const useAuth = (baseProvider: keyof typeof nativeProviders) => {
   const data = getData(baseProvider);
   const discovery = data.discoveryUrl
      ? useAutoDiscovery(data.discoveryUrl)
      : data.discovery;

   const funcSignIn = async (): Promise<SigninResult | null> => {
      const proxyRedirectUri = AuthSession.makeRedirectUri({ useProxy: true });

      const provider = isValidProvider(baseProvider)
         ? nativeProviders[baseProvider]
         : baseProvider;

      const signinInfo = await getSignInInfo({
         provider: provider,
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
      });

      request.state = state;
      request.codeChallenge = codeChallenge;
      await request.makeAuthUrlAsync(discovery!);

      const result = await request.promptAsync(discovery!, { useProxy: true });

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
