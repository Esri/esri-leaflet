module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('param', function (type, name, link)  {
    if(link){
      return '<nobr>&lt;<a href="'+link+'">'+ type +'</a>&gt; <code>' + name + '</code><nobr>';
    } else {
      return '<nobr>&lt;'+ type +'&gt; <code>' + name + '</code><nobr>';
    }
  });
};