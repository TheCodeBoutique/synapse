// ==========================================================================
// Project:   synapse framework
// View: SYN.createPhotoView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.createPhotoView = SC.View.extend({
	layout: { top: 0, right: 0, bottom: 0, left: 0 },
	childViews: ['postPhotoView'],
	
	postPhotoView: SC.View.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
	  layout: { top: 20, right: 20, bottom: 20, left: 20 },
    childViews: ['sectionLabel', 'titleField', 'contentField', 'fileField', 'previewPhotoView'],
    
    render: function(context){
    	context.push([
    		'<div class="forms-alt blog-title absolute">','</div>',	
    		'<div class="forms-alt blog-description absolute">','</div>',
    	].join(''))
    },

	  sectionLabel: SC.LabelView.extend({
		  layout: { top: 20, left: 20, height: 30, width: 225 },
		  localize: YES,
		  value: 'S.Share.Photo.PostPhoto'
	  }),

	  titleField: SC.TextFieldView.extend ({
		  layout: { top: 62, left: 265, height: 35, width: 271 },
		  type: 'email',
		  localize: YES,
		  hint: 'S.Share.Photo.Title',
		  valueBinding: 'Synapse.photoController.title'
	  }),

	  contentField: SC.TextFieldView.extend ({
		  layout: { top: 112, left: 265, bottom: 125, right: 30 },
		  isTextArea: YES,
		  localize: YES,
		  hint: 'S.Share.Photo.Content',
		  valueBinding: 'Synapse.photoController.description'
	  }),

	  fileField: SC.TextFieldView.extend ({
		  layout: { top: 65, left: 605, height: 30, width: 270 },
		  type: 'file',

		  inputChanged: function(evt){
			  var input = evt.target;
			  if (input.files && input.files[0]){
				  Synapse.fileshareController.loadInputFileData(input.files[0], 'image');
			  }
		  },

		  didCreateLayer: function(){
			  var that = this;
			  var layer = this.get('layer');

			  // only accept image inputs
			  $(layer).find('input').attr('accept','image/*');

			  $(layer).bind('change', function(evt){
				  that.inputChanged(evt);
			  });
		  }
	  
	  }),

    previewPhotoView: SC.ImageView.extend ({
		  layout: { top: 180, left: 265, height: 300, width: 400 },
      valueBinding: SC.Binding.from('Synapse.fileshareController.inputFileData')
    }),
    
  }),
  
});