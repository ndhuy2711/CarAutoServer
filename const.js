const _constant = {
    adtName: "adtautonomousadtuwm6xn7d2a",
    tenantId: "f01e930a-b52e-42b1-b70f-a8882b5d043b",
    clientId: "09cdc94f-7f92-404d-a63c-900c9ac52870",
    clientSecret: "9MT8Q~3ZFj3GgeD2fRs~CJX.lbyuAQ0PKbpQEaEK",
    scope: "https://digitaltwins.azure.net/.default",
    grantType: "client_credentials",
}

module.exports.constant = {
    dataGetAccessToken: {
        "client_id": _constant.clientId,
        "client_secret": _constant.clientSecret,
        "scope": _constant.scope,
        "grant_type": _constant.grantType
    },

    apiGetData: `https://${_constant.adtName}.api.eus.digitaltwins.azure.net`,
    apiGetToken: `https://login.microsoftonline.com/${_constant.tenantId}/oauth2/v2.0/token`
}
