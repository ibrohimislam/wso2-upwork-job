import * as Oidc from 'oidc-client';
import { userManagerSettings } from './constants';

const userManager = new Oidc.UserManager(userManagerSettings);
userManager.signinRedirectCallback().then((user) => {
    window.location.assign("/");
}).catch((err) => {
    console.log("err", err);
});