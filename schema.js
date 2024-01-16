const Joi=require("joi");
module.exports.listingSchema= Joi.object(
    {
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        description:Joi.string().required(),
        country:Joi.string().required(),
        location:Joi.string().required(),
        image: Joi.object({
            filename: Joi.string().required(),
            url: Joi.string().required(),
        }).optional(),
    }).required();
    module.exports.reviewSchema=Joi.object(
        {
            reviews :Joi.object(
                {
                    rating:Joi.number().required().min(1).max(5),
                    comment:Joi.string().required()
                }
            ).required(),
        }
    );