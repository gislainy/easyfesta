Accounts.onCreateUser((options, user) => {
  if (user.profile == null) {
    user.profile = {};
  }
  if (user.services != null) {
    var service = _.keys(user.services)[0];
    var email = user.services[service].email;
    if (email != null) {
      var oldUser = Meteor.users.findOne({
        "emails.address": email
      });
      if (oldUser != null) {
        if (oldUser.services == null) {
          oldUser.services = {};
        }
        if (service === "google" || service === "facebook" || service === "twitter") {
          oldUser.services[service] = user.services[service];
          Meteor.users.remove(oldUser._id);
          user = oldUser;
        }
      } else {
        if (service === "google" || service === "facebook" || service === "twitter") {
          if (user.services[service].email != null) {
            user.emails = [{
              address: user.services[service].email,
              verified: true
            }];
          } else {
            throw new Meteor.Error(500, service + " account has no email attached");
          }
          if(service === 'google') {
            user.profile.name = user.services[service].name;
            user.profile.avatar = user.services[service].picture;
          }
          if(service === 'facebook') {
            user.profile.name = user.services[service].name;
            user.profile.avatar = user.services[service].picture;
          }
        }
      }
    } 
  }
  return user;
});