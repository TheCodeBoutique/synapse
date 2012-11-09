// ==========================================================================
// Project:   Synapse.Photo
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.Photo = SC.Record.extend(
/** @scope Synapse.Photo.prototype */ {

  id: SC.Record.attr(String),
  title: SC.Record.attr(String),
  file: SC.Record.attr(String),
  description: SC.Record.attr(String),
  
  user: SC.Record.toOne("Synapse.User", {
    inverse: "photos",
    isMaster: NO
  })

}) ;
