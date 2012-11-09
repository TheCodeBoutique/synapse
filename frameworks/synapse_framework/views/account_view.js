// ==========================================================================
// Project:   synapse framework
// View: SYN.AccountView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the AccountView content here.  

SYN.AccountView = SC.View.extend(
  /** @scope SYN.AccountView.prototype */ {
  layout: { top: 0, right: 0, bottom: 0, left: 0 },
  childViews: [ 'userPhotoButton', 'userPhoto', 'basicInfoView', 'updatePasswordView', 'cancelButton', 'saveButton' ],

	userPhotoButton: SC.ButtonView.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius', 'userButtonPhoto'],
		layout: { top: 30, left: 45, height: 120, width: 130, zIndex: 100 },
		localize: YES,
		action: '',
		target: '',
		title: 'S.Account.AddPhoto',		
	}),
	
	userPhoto: SC.ImageView.design({
	  layout: { top: 30, left: 48, height: 100, width: 125 },
	  value: sc_static('images/user_photo_placeholder.png'), // this is tmp. It should be a value binding
	}),

	basicInfoView: SC.View.design ({
		layout: { top: 30, left: 200, height: 150, right: 100 },
		childViews: [ 'sectionLabel', 'firstName', 'lastName', 'location', 'email' ],
		classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
		
		render: function(context){
			context.push([
				'<div class="forms-alt basic-information-first absolute">','</div>',	
				'<div class="forms-alt basic-information-last absolute">','</div>',		
				'<div class="forms-alt basic-information-location absolute">','</div>',
				'<div class="forms-alt basic-information-email absolute">','</div>',		
			].join(''))
		},

		sectionLabel: SC.LabelView.design ({
			layout: { top: 15, right: 25, left: 25, height: 30 },
			localize: YES,
			value: 'S.Account.BasicInfo'
		}),

		firstName: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 40, left: 40, height: 25, width: 260 },
			localize: YES,
			hint: 'S.Account.FirstName',
			value: ''
		}),

		lastName: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 40, right: 40, height: 25, width: 260 },
			localize: YES,
			hint: 'S.Account.LastName',
			value: ''
		}),

		location: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 95, left: 40, height: 25, width: 260 },
			localize: YES,
			hint: 'S.Account.Location',
			value: ''
		}),

		email: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 95, right: 40, height: 25, width: 260 },
			type: 'email',
			localize: YES,
			hint: 'S.Account.Email',
			value: ''
		})
	}),

	updatePasswordView: SC.View.design ({
		layout: { top: 200, left: 200, height: 100, right: 100 },
		childViews: [ 'sectionLabel', 'password', 'confirmPassword' ],
		classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
		
		render: function(context){
			context.push([
				'<div class="forms-alt update-password-password absolute">','</div>',	
				'<div class="forms-alt update-password-password-confirm absolute">','</div>',
			].join(''))
		},

		sectionLabel: SC.LabelView.design ({
			layout: { top: 15, right: 25, left: 25, height: 30 },
			localize: YES,
			value: 'S.Account.UpdatePassword'
		}),

		password: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 40, left: 40, height: 25, width: 260 },
			type: 'password',
			localize: YES,
			hint: 'S.Account.Password',
			value: ''
		}),

		confirmPassword: SC.TextFieldView.design ({
			classNames: ['text_field_signin'],
			layout: { top: 40, right: 40, height: 25, width: 260 },
			type: 'password',
			localize: YES,
			hint: 'S.Account.ConfirmPassword',
			value: ''
		}),
	
	}),
	
  cancelButton: SC.ButtonView.design ({
    classNames: ['signin_action_button'],
 	  layout: { top: 320, right: 220, height: 25, width: 100 },
 	  localize: YES,
 	  action: 'cancelAccountUpdate',
	  target: 'Synapse.statechart',
 	  title: 'S.Button.Cancel'
  }),
  
  saveButton: SC.ButtonView.design ({
    classNames: ['signin_action_button'],
 	  layout: { top: 320, right: 100, height: 25, width: 100 },
 	  localize: YES,
 	  action: 'saveAccountUpdate',
 	  target: 'Synapse.statechart',
 	  title: 'S.Button.Save'
  })

});
