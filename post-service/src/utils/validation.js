import Joi from "joi";

const validateCreatePost = (data) => {
  console.log(data);
  const schema = Joi.object({
    content: Joi.string().min(3).max(5000).required(),
  });

  return schema.validate(data);
};

export { validateCreatePost };
