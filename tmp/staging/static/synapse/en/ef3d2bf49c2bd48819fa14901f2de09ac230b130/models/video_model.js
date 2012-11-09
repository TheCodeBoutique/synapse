// ==========================================================================
// Project:   Synapse.Video
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.Video = SC.Record.extend(
/** @scope Synapse.Video.prototype */ {

  id: SC.Record.attr(String),
  title: SC.Record.attr(String),
  file: SC.Record.attr(String),
  description: SC.Record.attr(String)

}) ;
