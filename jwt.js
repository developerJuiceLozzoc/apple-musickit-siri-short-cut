const fs = require('fs')
const jose = require('jose')
const jwt = require('jsonwebtoken')

let privateKey = fs.readFileSync('./AuthKey_949A39XT34.p8', 'utf8');

let credentials = {
  /* obtained by creating a key by linking existing music kit identifier
  create this in developer.apple.com -> Account -> Program resources -> Keys,
  you must first create identifier because you create a key with existing identifier.
  */
  privateKey: privateKey,
  /* A identifier or public key i believe.
  create this in developer.apple.com -> Account -> Program resources -> Identifers.
   Create identifier with musicKit &OR shazam kit consents checkboxed.
  */
  musicKitIdentifier: '949A39XT34',
  /* enroll in apple developer account program
  developer.apple.com -> Account -> MemberShip Details -> TeamId
  */
  issuerTeamId: "3463GQXGTB"
}
/** https://github.com/Exerra/node-musickit-api
 *
 * @param {Object} credentials Apple Music credentials. Consists of a key containing MusicKit privileges, the team ID of developer account and the ID of the key
 * @param {string} credentials.key A valid key generated from developer console that has MusicKit permissions
 * @param {string} credentials.keyId ID of the credentials.key
 * @param {string} credentials.teamId ID of the team that credentials.key belongs to
 */
function ExerraSign(){
	if (!credentials || !credentials.privateKey || !credentials.issuerTeamId || !credentials.musicKitIdentifier) {
		throw new Error("No credentials supplied")
	}

	return jwt.sign({}, credentials.privateKey, {
		algorithm: 'ES256',
		expiresIn: '180d',
		issuer: credentials.issuerTeamId,
		header: {
			alg: 'ES256',
			kid: credentials.musicKitIdentifier
		}
	});
}




async function joseSign() {
  const {
    issuerTeamId, musicKitIdentifier, privateKey
  } = credentials
  const algorithm = 'ES256'
  const ecPrivateKey = await jose.importPKCS8(privateKey, algorithm)
  const payload = {
    iss: issuerTeamId,
    iat: Math.round(Date.now() / 1000),
    exp: Math.round(Date.now() / 1000) + 1200
  }
  const jwt = await new jose.SignJWT(payload)
  .setProtectedHeader({
    alg: "ES256",
    kid: musicKitIdentifier,
    typ: "JWT"
   })
  .sign(ecPrivateKey)
  return jwt;
}

module.exports = {
  joseSign,
  ExerraSign
};
