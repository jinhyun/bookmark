Handlebars.registerHelper('dateformat', function(date) {
  return $.format.date(date, "yyyy/MM/dd HH:mm:ss");
});