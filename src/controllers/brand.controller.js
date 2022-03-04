const brandService = require('../services/brand.service')
const handleError = require("../utils/handle-error")

const getBrands = handleError(async (req, res) => {
  const {categoryGroupCode, categoryCode} = req.query;
  let brands = null;
  if(categoryCode){
    brands = await brandService.getBrandsByCategoryCode(categoryCode);
  }else if (categoryGroupCode){
    brands = await brandService.getBrandsByCategoryGroupCode(categoryGroupCode);
  }else{
    brands = await brandService.getBrands();
  }

  res.json(brands);
})

module.exports = {
  getBrands
}