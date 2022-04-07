const axios = require('axios');

const controller = {};

controller.getResults = (req, res, next) => {
  console.log(req);

  const radius = Math.round((req.body.radius || 5) * 1609.34);
  const location = (req.body.location || 10109);
  const categories = (req.body.categories || []);
  console.log(categories);
  axios({
    method: 'GET',
    url: 'https://api.yelp.com/v3/businesses/search',
    // data: {},
    params: {
      'attributes' : 'wheelchair_accessible',
      'radius': radius,
      'location': location,
      'categories': categories,
    },
    headers: {
      // 'Content-Type': 'application/json',
      // 'Connection' : 'keep-alive',
      'Authorization' : 'Bearer mcClm66r5Ii_n-s-EEaMJ3og-tE6ffLsnXqKbEFNtSpjSLjJu4pWP7VijUXJZN9Rk3MyucppPhh96P8iXGE-JHulyNDSG8PGQOxPE5pm7GLcD1iBYnQ-O_x8jkVIYnYx',
    },
  })
  .then((response) => {
    res.locals = response.data.businesses.map((business) => ({
        name : business.name,
        image : business.image_url,
        url : business.url,
        address : `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`,
        phone : `(${business.phone.slice(2, 5)}) ${business.phone.slice(5, 8)}-${business.phone.slice(8)}`,
        rating : business.rating,
        price : business.price,
        distance :`${Math.round(business.distance * .00062137 * 100) / 100} mi`
    }));
  })
  .then(() => { next(); })
  .catch((err) => next({
      log: `Error in getResults controller: ${err}`,
      message: { err: 'See log for error details'},
  }));
}


module.exports = controller;