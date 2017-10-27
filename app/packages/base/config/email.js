Meteor.methods({
  sendEmail: function (to, from, subject, text) {
      this.unblock();
      Email.send({
          to: to,
          from: from,
          subject: subject,
          text: text
      });
  }
});
Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://perdeuachou.ufg@gmail.com:construcao@smtp.gmail.com:587';
});