// ==========================================================================
// Project:   Synapse.User
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.User = SC.Record.extend(
/** @scope Synapse.User.prototype */ {

  // userID: SC.Record.attr(String), 
  firstName: SC.Record.attr(String),
  lastName: SC.Record.attr(String),
  location: SC.Record.attr(String),
  email: SC.Record.attr(String),
  password: SC.Record.attr(String),
  photo: SC.Record.attr(String),
  
  blogs: SC.Record.toMany("Synapse.Blog", {
    inverse: "user",
    isMaster: YES
  }),
  
  photos: SC.Record.toMany("Synapse.Photo", {
    inverse: "user",
    isMaster: YES
  }),
  
  websites: SC.Record.toMany("Synapse.Website", {
    inverse: "user",
    isMaster: YES
  }),

}) ;
