/**
 * Clock.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    enabled: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    status: {
      type: 'string',
    },
    timevalue: {
      type: 'INTEGER',
      required: true,
      defaultsTo: 10 //seconds
    },

    users: {
      collection: "User"
    },
    ticker: {
      type: "objectid"
    }
  }
  

};

