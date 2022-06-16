import { Schema, model } from "mongoose";

const sso = new Schema({
  ssoString: { type: Schema.Types.String, required: true },
  name: { type: Schema.Types.String },
  email: { type: Schema.Types.String },
});

export default model('sso', sso);