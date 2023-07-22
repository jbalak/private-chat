const Boom = require("@hapi/boom");
const { isNull, isUndefined, isEmpty } = require("lodash");
const mongoose = require("mongoose");
const Axios = require("axios").default;
const jwt = require("jsonwebtoken");

const httpResp = (status, message, code, data, metadata) => {
  const response = {
    status: status,
    message: message,
    code: code,
    statusCode: code,
    data: data,
  };
  if (isDef(metadata)) {
    response.metadata = metadata;
  }
  return response;
};

const isDef = (param) => {
  if (isNull(param) || isUndefined(param)) {
    return false;
  } else {
    return true;
  }
};

const errBuilder = (err) => {
  let final_error = err;

  if (err.isServer) {
    // log the error...
    // probably you don't want to log unauthorized access
    // or do you?
  }

  // Restructuring error data
  // If the error belongs to boom error (Check boom module: https://www.npmjs.com/package/boom)
  if (err.isBoom) {
    console.log("Boom old err");
    console.log(err);
    // err.output.statusCode = 400;
    err.output.payload.status = false;
    err.output.payload.code = err.output.statusCode;
    if (isDef(err.data)) {
      err.output.payload.data = err.data;
    }
    err.reformat();
    final_error = err.output.payload;
    if (isDef(err.message) && final_error.statusCode == 500) {
      final_error.message = err.message;
    }

    // return res.status(err.output.statusCode).send(err.output.payload);
  } else {
    // If the error are other errors
    err.status = false;
    err.code = err.statusCode;
    if (!isDef(err.message) && isDef(err.type)) {
      err.message = err.type;
    }
  }

  return final_error;
};

const errHandler = (error, res) => {
  const resp = httpResp(false, "There is some error occured", 500, error);
  return res.status(resp.code).send(resp);
};

const successHandler = (res, data, message, metadata) => {
  message = message || "Operation successful";
  let resp;
  if (isDef(metadata)) {
    resp = httpResp(true, message, 200, data, metadata);
  } else {
    resp = httpResp(true, message, 200, data);
  }

  return res.status(resp.code).send(resp);
};

const socketErrHandler = (error) => {
  let newErr = errBuilder(error);

  return newErr;
};

const socketSuccessHandler = async (userIds = [], event, data, socket) => {
  try {
    const newUserIds = [...userIds];
    if (!isDef(event) || isEmpty(event)) {
      throw Boom.badRequest("valid event name is required");
    }

    newUserIds.push("test_id");
    let promisedData = newUserIds.map(async (userId) => {
      let socketId = userId;

      console.log({ socketId });

      if (isDef(socketId)) {
        const emmitingOnEvent = `${event}-${socketId}`;
        console.log({ emmitingOnEvent });

        socket
          .to(socketId)
          .emit(emmitingOnEvent, { data, operationName: event });
        return true;
      }
    });
    await Promise.all(promisedData);
    return true;
  } catch (error) {
    throw Boom.boomify(error);
  }
};

const isLiteralObject = (a) => {
  return !!a && a.constructor === Object;
};

// Converts all MongoIDs in the object to the plain string
const leanObject = (object) => {
  if (Array.isArray(object)) {
    let array = object;
    array = array.map((obj) => {
      return leanObject(obj);
    });
    return array;
  }
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      if (isDef(object[key])) {
        if (
          mongoose.isValidObjectId(object[key]) &&
          !isLiteralObject(object[key])
        ) {
          object[key] = object[key].toString();
        }
        if (typeof object[key] == "object" && isLiteralObject(object[key])) {
          object[key] = leanObject(object[key]);
        }
      } else {
        object = omit(object, [key]);
      }
    }
  }
  return object;
};

const getRole = (type) => {
  if (!isDef(type)) {
    return null;
  }
  if (type == 1) {
    return "doctor";
  } else if (type == 2) {
    return "patient";
  } else if (type == 3) {
    return "admin";
  } else if (type == 4) {
    return "nurse";
  } else if (type == 5) {
    return "secretary";
  } else {
    return null;
  }
};

const restApi = async (url, method, body, headers) => {
  try {
    if (!isDef(method)) {
      method = "GET";
    } else method = method.toUpperCase();

    if (!isDef(headers)) {
      headers = {
        "Content-Type": "application/json",
      };
    }

    if (!isDef(url)) {
      return null;
    }

    const res = await Axios({
      url,
      method,
      headers: {
        ...headers,
      },
      data: body,
    });
    return res.data.data;
  } catch (error) {
    throw Boom.boomify(error);
  }
};

const getDecodedJwtToken = (req, token) => {
  try {
    if (!isDef(token)) {
      if (!isDef(req)) {
        return null;
      }
      token = req?.headers?.["x-access-token"] ?? req?.headers?.["token"];

      if (!token) {
        return null;
      }
    }
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

const isValidObjectId = (id) => {
  id = `${id}`;
  return mongoose.isValidObjectId(id);
};
module.exports = {
  isDef,
  socketErrHandler,
  socketSuccessHandler,
  leanObject,
  getRole,
  errBuilder,
  errHandler,
  successHandler,
  restApi,
  getDecodedJwtToken,
  isValidObjectId,
};
