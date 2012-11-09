// ==========================================================================
// Project:   synapse framework
// View: SYN.LoginView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// The login view... it does what it sounds like.  Imported layout from the TCB.LoginView



SYN.LoginView = SC.View.extend ({
	childViews: ['appIcon', 'viewContainer'],

	
	appIcon: SC.ImageView.design({
	  layout: { top: 165, left: 125, height: 56, width: 300 },
    value: sc_static('/images/synapse_icon_horizontal.png'),
    canLoadInBackground: YES,
  }),
	
	viewContainer: SC.View.design({
		classNames: ['embeded_gradient'],
	  layout: { top: 215, centerX: 0, height: 300, width: 755 },
	  childViews: ['actionButton', 'viewDescription', 'userNameForm', 'passwordForm', 'errorMessage'],
	
		render: function(context){
			context.push([
				'<div class="shadow_view anchor_top absolute">','</div>',
				'<div class="shadow_view flipped_element anchor_bottom absolute">','</div>',
				'<div class="sign_in_text text_style absolute">',"Sign In",'</div>',	
				'<div class="line absolute">','</div>',
				'<div class="line_forms_signin absolute">','</div>',
				'<div class="forms signin_forms absolute">','</div>',		
			].join(''))		
		},

		actionButton: SC.ButtonView.design({
			classNames: ['signin_action_button'],
		  layout: { right: 50, bottom: 20, height: 25, width: 100 },
		  title: 'Sign In',
		  action: 'ignoreAuth',
		  target: 'Synapse.statechart',
		  isDefault: YES
		}),

		viewDescription: SC.LabelView.design({
			classNames: ['text_style_paragraph'],
		  layout: { top: 120, left: 35, height: 100, width: 300 },
		  value: 'Login to your Synapse account to share and recieve information.  New to Synapse?  Select the signup button.'
		}),
		
		userNameForm: SC.TextFieldView.design({
			classNames: ['text_field_signin'],
		  layout: { top: 112, right: 98, height: 36, width: 260 },
		  hint: 'Email',
		  valueBinding: 'Synapse.authController.username',
		  isPassword: NO,
		  isTextArea: NO
		}),
		
		passwordForm: SC.TextFieldView.design({
			classNames: ['text_field_signin'],
		  layout: { top: 153, right: 98, height: 36, width: 260 },
		  hint: 'Password',
		  valueBinding: 'Synapse.authController.password',
		  isPassword: YES,
		  isTextArea: NO
		}),
		
		errorMessage: SC.LabelView.design({
		  classNames: ['text_style_paragraph'],
		  layout: { top: 200, right: 98, height: 40, width: 260 },
		  valueBinding: 'Synapse.loginController.errorMessage'
		}),
	  
	}),	
 
});

