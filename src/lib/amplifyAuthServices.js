import { CognitoJwtVerifier } from "aws-jwt-verify";

const poolData = {
  UserPoolId: process.env.poolId,
  ClientId: process.env.clientId,
};

const validateToken = async (token) => {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: poolData.UserPoolId,
    tokenUse: "id",
    clientId: poolData.ClientId,
    includeRawJwtInErrors: true,
  });

  try {
    const result = await verifier.verify(token);
    if (result) return { userData: result };
    else throw result;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default {
  validateToken: validateToken,
};