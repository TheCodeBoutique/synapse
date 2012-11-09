// ==========================================================================
// Project:   Synapse.fileshareController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  Manages the creation & uploading of new content
  
  @extends SC.ObjectController
*/
Synapse.fileshareController = SC.ObjectController.create(
/** @scope Synapse.fileshareController.prototype */ {

  
  // video, image, blog, website
	fileType: null,

  // binary data for image/file selected for upload
  inputFileData: null,
  

  // from input form, loads data from local
	loadInputFileData: function(inputFile, fileType){

		this.set('fileType', fileType);

		var reader = new FileReader();
		reader.onload = function(e){
			Synapse.fileshareController.set('inputFileData', e.target.result);
		}
		reader.readAsDataURL(inputFile);
	},

});
