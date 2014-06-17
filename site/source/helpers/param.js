module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('param', function (type, name, link)  {
    if(typeof link === 'string'){
      return '<nobr class="param"><span>&lt;<a href="'+link+'">'+ type +'</a>&gt;</span> <code>' + name + '</code></nobr>';
    } else {
      return '<nobr class="param"><span>&lt;'+ type +'&gt;</span> <code>' + name + '</code></nobr>';
    }
  });
};