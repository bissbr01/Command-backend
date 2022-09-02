const router = require('express').Router();
const axios = require('axios').default;
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  // post to AuthO app api for token
  // currently only produces test development token.
  try {
    const response = await axios.post(
      'https://dev-w8p6njku.us.auth0.com/oauth/token',
      {
        client_id: 'ob4DlgUf1NJhn09HpsUlMpnJrjvSVOy8',
        client_secret:
          'C7a8R3Q4iB2VEjakO8VcKuN_m4cZJZbE18RGOgAXrcrx_85D_uVGYytO_B0l8t8Z',
        audience: 'https://scrum-management-backend.herokuapp.com/',
        grant_type: 'client_credentials',
      }
    );
    const token = response.data.access_token;
    console.log('token: ', token);
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
