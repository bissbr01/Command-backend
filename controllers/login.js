const router = require('express').Router();
const axios = require('axios').default;
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  // const { body } = req;

  // const user = await User.findOne({
  //   where: {
  //     username: body.username,
  //   },
  // });
  // if (!user) {
  //   throw new Error('Resource not found');
  // }

  // if (user.disabled) throw new Error('account disabled, please contact admin');
  // const passwordCorrect = await bcrypt.compare(body.password, user.password);
  // if (!passwordCorrect) {
  //   throw new Error('Invalid username or password');
  // }

  // post to AuthO app api for token
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
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
