const { body, validationResult, check } = require('express-validator');

const validator = () => {
    let arrayValidationItems = [
        check('name').isLength({ min: 5 }).withMessage('Must be at least 10 chars long').isString(),
        check('ordering').isNumeric().isInt({gt: 0}).withMessage("Must be an integer number"),
        check('status').not().isEmpty().not().isIn(["novalue"]).withMessage('Must select a status option'), 
      ]; 
    return arrayValidationItems; 
}
module.exports = {
    validator
}