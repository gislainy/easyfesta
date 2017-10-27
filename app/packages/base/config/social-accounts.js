ServiceConfiguration.configurations.remove({
  service: 'facebook'
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: '324822281263904',
  clientId: '324822281263904',
  loginStyle: 'popup',
  secret: '55990f68322e778b34a0b3713beb5a62'
});

ServiceConfiguration.configurations.remove({
  service: 'google'
});

ServiceConfiguration.configurations.insert({
  service: 'google',
  loginStyle: 'popup',
  clientId: '1031713603980-4eu5huposdmkjfubcva4jglsbdqo5d93.apps.googleusercontent.com',
  appId: '1031713603980-4eu5huposdmkjfubcva4jglsbdqo5d93.apps.googleusercontent.com',
  secret: '5x8B-1J7D-_HJRGeHxtEZ9fl',
});