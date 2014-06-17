module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('trim', function (string)  {
    return string.trim();
  });
};