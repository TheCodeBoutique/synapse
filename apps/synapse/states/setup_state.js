Synapse.SetupState = SC.State.extend({ 
  
  enterState: function() {
    Synapse.getPath('mainPage.mainPane').append();
    this.invokeLater(this.fadeIn, 500);
  },

	fadeIn: function() {
	  Synapse.getPath('mainPage.mainPane.textureView').animate('opacity', 0.3, {duration: 0.8,timing:'ease-in-out'});
	  Synapse.getPath('mainPage.mainPane.mainView').animate('opacity', 1.0, {duration: 0.8,timing:'ease-in-out'});
		this.invokeLater(this.goToUnauthenticatedState, 100);
	},  
	
	goToUnauthenticatedState: function() {
		this.gotoState('unauthenticatedState');
	},

  exitState: function() {
  }

});

