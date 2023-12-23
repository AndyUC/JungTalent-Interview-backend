const BadrequestError = require("../middleware/badrequest");
const NotfoundError = require('../middleware/notfound');
const { StatusCodes } = require("http-status-codes");
const ProductCreateOrderSchema = require('../schema/productSchema');
const getallproduct = async (req, res) => {
    const products = await ProductCreateOrderSchema.find()
    res.status(200).json(products)
}

const getproduct = async (req, res) => {
    const { id: productid } = req.params
    const product = await ProductCreateOrderSchema.findOne({ _id: productid })
    if (!product) {
        throw new NotfoundError(`No product with ID${productid}`);
    }
    res.status(201).json(product)
}
module.exports = { getallproduct, getproduct }