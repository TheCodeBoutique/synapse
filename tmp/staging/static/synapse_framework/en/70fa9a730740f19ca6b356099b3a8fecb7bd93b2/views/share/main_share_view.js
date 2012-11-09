// ==========================================================================
// Project:   synapse framework
// View: SYN.ShareView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.ShareView = SC.View.extend(
  /** @scope SYN.ShareView.prototype */ {
  layout: { top: 0, right: 0, bottom: 0, left: 0 },
  childViews: ['sectionLabel', 'contentTypeBar', 'formView', 'cancelButton', 'saveButton'],

  sectionLabel: SC.LabelView.design ({
		layout: { top: 15, right: 25, left: 25, height: 30 },
		localize: YES,
		value: 'S.Share.WhatToShare'
  }),

  contentTypeBar: SC.View.design ({
    classNames: ['embeded_gradient'],
  	layout: { top: 40, right: 20, left: 20, height: 125 },
  	childViews: [ 'blogButton', 'photoButton', 'videoButton', 'websiteButton' ],
  	
  	render: function(context){
			context.push([
				'<div class="shadow_view_long anchor_top absolute">','</div>',
				'<div class="shadow_view_long flipped_element anchor_bottom absolute">','</div>',	
			].join(''))		
		},

  	blogButton: SC.ButtonView.extend({
			layout: { left: .20, centerY: 0, height: 100, width: 90 },
			localize: YES,
			action: 'goToBlogPostState',
			target: 'Synapse.statechart',
			title: 'S.Share.Blog'
		}),

  	photoButton: SC.ButtonView.extend({
			layout: { left: 0.40, centerY: 0, height: 100, width: 90 },
			localize: YES,
			action: 'goToPhotoPostState',
			target: 'Synapse.statechart',
			title: 'S.Share.Photo'
		}),

  	videoButton: SC.ButtonView.extend({
			layout: { left: 0.60, centerY: 0, height: 100, width: 90 },
			localize: YES,
			action: 'goToVideoPostState',
			target: 'Synapse.statechart',
			title: 'S.Share.Video'
		}),

  	websiteButton: SC.ButtonView.extend({
			layout: { left: 0.80, centerY: 0, height: 100, width: 90 },
			localize: YES,
			action: 'goToWebPostState',
			target: 'Synapse.statechart',
			title: 'S.Share.WebSite'
		})
  }),

 	formView: SC.ContainerView.design({
 	  layout: { top: 185, right: 0, bottom: 0, left: 0 },
    nowShowingBinding: 'Synapse.viewController.shareViewNowShowing'
	}),

  cancelButton: SC.ButtonView.extend({
    classNames: ['cancel_action_button'],
	  layout: { bottom: 50, right: 170, height: 25, width: 100 },
		localize: YES,
		action: 'cancelPost',
		target: 'Synapse.statechart',
		title: 'S.Button.Cancel'
	}),
	
	saveButton: SC.ButtonView.extend({
	  classNames: ['signin_action_button'],
	  layout: { bottom: 50, right: 50, height: 25, width: 100 },
		localize: YES,
		action: 'commitPost',
		target: 'Synapse.statechart',
		title: 'S.Button.Save'
	})
	
});
