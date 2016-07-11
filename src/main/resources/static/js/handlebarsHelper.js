Handlebars.registerHelper('dateformat', function(date) {
  return $.format.date(date, "yyyy/MM/dd "+"\u00A0"+ "HH:mm");
});