const { Schema, model } = require('mongoose');

// Define the schema for reaction roles
const reactionRoleSchema = new Schema({
  messageId: { type: String, required: true },
  emoji: { type: String, required: true },
  roleId: { type: String, required: true },
  enabled: { type: Boolean, default: true }, // Whether the reaction role is enabled or disabled
});

// Create the model based on the schema
const ReactionRole = model('ReactionRole', reactionRoleSchema);

module.exports = ReactionRole;