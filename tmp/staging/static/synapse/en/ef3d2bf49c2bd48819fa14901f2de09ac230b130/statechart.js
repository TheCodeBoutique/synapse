Synapse.statechart = SC.Statechart.create({

  initialState: 'setupState',
  
  setupState: SC.State.plugin('Synapse.SetupState'),
  unauthenticatedState: SC.State.plugin('Synapse.UnauthenticatedState'),
  authenticatedState: SC.State.plugin('Synapse.AuthenticatedState')

});