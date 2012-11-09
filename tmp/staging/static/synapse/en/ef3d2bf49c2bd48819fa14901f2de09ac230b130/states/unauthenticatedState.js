Synapse.UnauthenticatedState = SC.State.extend({ 
  
  enterState: function() {
    console.log("Entering Unauthenticated State");
    Synapse.authController.set('username', '');
	  Synapse.authController.set('password', '');
		Synapse.viewController.set('mainView','SYN.LoginView');
  },
  
  ignoreAuth: function() {
    Synapse.viewController.set('mainView','SYN.MainApplicationView');
    Synapse.viewController.set('shareViewNowShowing','SYN.createBlogView');
    this.gotoState('mainNavState');
  },
  
  checkingAuthentication: function(ctx) {
    Synapse.statechart.gotoState('authenticatedState');
    
    var dataHash = {
			username: Synapse.authController.get('username'),
			password: Synapse.authController.get('password')
		};
		
    SC.Request.postUrl(Synapse.URL.login)
      .json(YES)
  		.header('X-Version', '1.0')
      .notify(this, 'responseStatus', ctx)
      .send(dataHash);
  },
  
  responseStatus: function(response, ctx) {
    if (SC.$ok(response)) {
      Synapse.statechart.gotoState('authenticatedState');
    } else {
      // Synapse.authController.set('password', '');
    }
  },
  
  exitState: function() {
    
  },
  
  // tmp
  mainNavState: SC.State.plugin('Synapse.MainNavState')

});

