const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const paramsValidator = require("../middlewares/params-validator");
const userResolver = require("../middlewares/user-resolver");
const getCategoryForUser = require("./categories.service");

async function controller(req, res) {
  const id = req.body;

  const result = await getCategoryForUser(id);

  if (!result) {
    res.json({
      message: "No category found for the id",
    });
  } else {
    res.json({
      message: "Category Found",
      data: result,
    });
  }
}

function validateParams(req, res, next) {
  const errorTypedFields = ["id"].filter(
    (field) => typeof Reflect.get(req.body, "id") !== "string"
  );

  if (errorTypedFields.length > 0) {
    throw new httpError.BadRequest(
      `Field '${errorTypedFields.join(",")}' should be of string type`
    );
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamValidator(
  ["id"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler(controller, [userResolver, missingParamsValidator, validateParams])