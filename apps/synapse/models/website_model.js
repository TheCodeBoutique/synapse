// ==========================================================================
// Project:   Synapse.Website
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.Website = SC.Record.extend(
/** @scope Synapse.Website.prototype */ {

  id: SC.Record.attr(String),
  title: SC.Record.attr(String),
  url: SC.Record.attr(String),
  description: SC.Record.attr(String),
  
  user: SC.Record.toOne("Synapse.User", {
    inverse: "websites",
    isMaster: NO
  })

}) ;
