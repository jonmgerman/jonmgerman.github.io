export const config = {
    auth: {
        client_id: '1a4nhn6ofmmkj8krvnci85dssk',
        base_url: 'https://oidanew.com',
        main_uri: base_url + '/main.html',
        logout_uri: 'https://oidanew.com',
        authority_uri: "https://us-east-13wianfaoi.auth.us-east-1.amazoncognito.com",
        cognito_login :'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_3WiAnFAoi',
        sign_in_uri: 'https://us-east-13wianfaoi.auth.us-east-1.amazoncognito.com/login',
        redirectUri: base_url + "/callback",
        audience_uri: 'oidanews.com',
        response_type: 'code',
        scope: 'openid profile email',
        loadUserInfo: true
    }
};
