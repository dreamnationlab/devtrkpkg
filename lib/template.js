module.exports = {
  HTML:function(title, body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>DEV SERVER- ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">DEV SERVER</a></h1>      
      ${body}
    </body>
    </html>`;
  },
  list:function(filelist){
    var list ='<ul>';
    var i = 0;
    while(i < filelist.length){
      list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i += 1;
    }
    list = list + '</ul>';
    return list;
  }
}
