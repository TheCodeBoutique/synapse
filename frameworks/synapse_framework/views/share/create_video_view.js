// ==========================================================================
// Project:   synapse framework
// View: SYN.createVideoView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.createVideoView = SC.View.extend({
	layout: { top: 0, right: 0, bottom: 0, left: 0 },
	childViews: ['postVideoView'],
	
	postVideoView: SC.View.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
	  layout: { top: 20, right: 20, bottom: 20, left: 20 },
    childViews: ['sectionLabel', 'titleField', 'contentField', 'fileField'],
    
    render: function(context){
    	context.push([
    		'<div class="forms-alt blog-title absolute">','</div>',	
    		'<div class="forms-alt blog-description absolute">','</div>',
    	].join(''))
    },
    
    sectionLabel: SC.LabelView.extend({
    	layout: { top: 20, left: 20, height: 30, width: 225 },
    	localize: YES,
    	value: 'S.Share.Video.PostVideo'
    }),
    
    titleField: SC.TextFieldView.extend({
    	layout: { top: 62, left: 265, height: 35, width: 271 },
    	type: 'email',
    	localize: YES,
    	hint: 'S.Share.Video.Title',
    	valueBinding: 'Synapse.videoController.title'
    }),
    
    contentField: SC.TextFieldView.extend({
    	layout: { top: 112, left: 265, bottom: 125, right: 30 },
    	isTextArea: YES,
    	localize: YES,
    	hint: 'S.Share.Video.Content',
    	valueBinding: 'Synapse.videoController.description'
    }),


    fileField: SC.TextFieldView.extend ({
      layout: { top: 65, left: 605, height: 30, width: 270 },
      type: 'file',

      inputChanged: function(evt){
          var input = evt.target;
          if (input.files && input.files[0]){
              Synapse.fileshareController.loadInputFileData(input.files[0], 'video');
          }
      },

      didCreateLayer: function(){
        var that = this;
        var layer = this.get('layer');

        // only accept video inputs
        $(layer).find('input').attr('accept','video/*');

        $(layer).bind('change', function(evt){
          that.inputChanged(evt);
        });
      }

    })

    
  }),  
        
});