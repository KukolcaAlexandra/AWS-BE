const Effect = {
  Allow: 'Allow',
  Deny: 'Deny',
}

const generatePolicyDocument = (effect, resource) => {
  return {
    Version: '2012-10-17',
    Statement: [{
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource
    }]
  }
}

const generateResponse = (principalId, effect, resource) => {
  return {
    principalId,
    policyDocument: generatePolicyDocument(effect, resource),
  }
}

export const basicAuthorizer = async (event) => {
  const { authorizationToken, methodArn } = event;
  const principalId = 'test';

  const buffer = Buffer.from(authorizationToken.replace('Basic ', ''), 'base64');
  const loginAndPassword = buffer.toString('utf-8').split(':');
  const login = loginAndPassword[0];
  const password = loginAndPassword[1];

  const response = login === process.env.LOGIN && password === process.env.PASSWORD
    ? generateResponse(principalId, Effect.Allow, methodArn)
    : generateResponse(principalId, Effect.Deny, methodArn);

  return response;
};
