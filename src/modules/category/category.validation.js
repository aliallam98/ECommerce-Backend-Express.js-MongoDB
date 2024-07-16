import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const create = {
  body: joi.object().required().keys({
    name: generalFields.name,
  }),
  file: generalFields.file.required(),
  params: joi.object().required().keys({}),
  query: joi.object().required().keys({}),
};

export const update = {
  body: joi.object().required().keys({
    name: generalFields.name,
  }),
  file: generalFields.file,
  params: joi.object().required().keys({
    id: generalFields.id,
  }),
  query: joi.object().required().keys({}),
};

export const deleteCategory = {
  body: joi.object().required().keys({}),
  file: generalFields.file,
  params: joi.object().required().keys({
    id: generalFields.id,
  }),
  query: joi.object().required().keys({}),
};

export const getById = {
  body: joi.object().required().keys({}),
  file: generalFields.file,
  params: joi.object().required().keys({
    id: generalFields.id,
  }),
  query: joi.object().required().keys({}),
};
