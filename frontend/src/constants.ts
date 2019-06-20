export const userManagerSettings: Oidc.UserManagerSettings = {
	authority: 'http://localhost:7000/auth/realms/ehealth-dev/',
	client_id: 'ehealth-app',
	response_type: 'id_token token',
	scope: 'openid profile email api',
	automaticSilentRenew: true,
	filterProtocolClaims: true,
	loadUserInfo: true
};
