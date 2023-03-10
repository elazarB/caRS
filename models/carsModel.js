const mongoose = require("mongoose");
const Joi = require("joi");

let carsSchema = new mongoose.Schema({
  license_number: String,
  manufacturer_en: String,
  manufacturer_hb: String,
  model_en: String,
  model_hb: String,
  year: Number,
  color: String,
  finish_level: String,
  km: Number,
  status: String,
  branch: String,
  fuel_type: String,
  exp_ins: Date,
  exp_test:Date,
  last_treatment: Date,
  km_next_treatment: Number,
  date_next_treatment: Date,
  class: String,
  deductible: Number,
  coder: Number,
  img_manufacturer: String,
  added_by: String,
  date_join:{
    type: Date, default: Date.now
  }
})
exports.CarsModel = mongoose.model("cars", carsSchema)

exports.validateCars = (_reqBody) => {
  let joiSchema = Joi.object({
    license_number: Joi.string().min(7).max(10).required(),
    manufacturer_en: Joi.string().min(2).max(150).required(),
    manufacturer_hb: Joi.string().min(2).max(150).required(),
    model_en: Joi.string().min(1).max(150).required(),
    model_hb: Joi.string().min(1).max(150).required(),
    year: Joi.number().min(2).max(30).required(),
    color: Joi.string().min(2).max(150).required(),
    finish_level: Joi.string().min(2).max(150).required(),
    km: Joi.number().min(2).max(150).required(),
    status: Joi.string().min(2).max(150).required(),
    branch: Joi.string().min(2).max(150).required(),
    fuel_type: Joi.string().min(2).max(150).required(),
    exp_ins: Joi.date().min("1-1-2023").max("1-1-2100").required(),
    exp_test: Joi.date().min("1-1-2020").max("1-1-2100").required(),
    last_treatment: Joi.date().min("1-1-2023").max("1-1-2100").required(),
    km_next_treatment: Joi.number().min(2).max(5000).required(),
    date_next_treatment: Joi.date().min("1-1-2023").max("1-1-2100").required(),
    class: Joi.string().min(2).max(150).required(),
    deductible: Joi.number().min(2).max(150).required(),
    coder: Joi.number().min(2).max(20).required(),
    img_manufacturer: Joi.string().min(2).max(1000).required(),
    added_by: Joi.string().min(2).max(150).required(),
    date_join:Joi.Date().min("1-1-2023").max("1-1-2100").required(),
  })
  return joiSchema.validate(_reqBody)
}