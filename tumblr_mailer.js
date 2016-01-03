var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');

var csvFile = fs.readFileSync("friend_list.csv","utf8");


function csvParse(csvFile){

  var rows = csvFile.split("\n");
  var result = [];
  var headers = rows[0].split(",");
  for (var i = 1; i < rows.length; i++) {
    if (rows[i].length !== 0) {
    	var contact = rows[i].split(",");
      var rowObject = {};
    	for (var j = 0; j < contact.length; j++) {
    		rowObject[headers[j]] = contact[j];
    	}
  	 result.push(rowObject);
    }
  }
  return result;
}
var emailTemplate = fs.readFileSync('email_template.html', 'utf8');

var friendList = csvParse(csvFile);

var client = tumblr.createClient({
  consumer_key: 'XXXXXXXXXXXXXXXXXXXXX', //fill in credentials
  consumer_secret: 'XXXXXXXXXXXXXXXXXXXXX', //fill in credentials
  token: 'XXXXXXXXXXXXXXXXXXXXX', //fill in credentials 
  token_secret: 'XXXXXXXXXXXXXXXXXXXXX' //fill in credentials
});

var postLinks = [];

client.posts('pipemadame.tumblr.com', function(err, blog){

  var sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7);
  for (var i = 0; i < blog.posts.length; i++) {
    var postDate = new Date(blog.posts[i].date);
    if (postDate > sevenDaysAgo) {
      var recentPost = {
        href: blog.posts[i].post_url,
        title: blog.posts[i].title
      }
      postLinks.push(recentPost);
    }
  }
  for (var i = 0; i < friendList.length; i++) {
    friendList[i].latestPosts = postLinks;

    var customizedTemplate = ejs.render(emailTemplate, friendList[i]);
    sendEmail(friendList[i].firstName, friendList[i].emailAddress, "Liana", "lrc47@cornell.edu", "Fullstack Tumblr Email", customizedTemplate); 
  }
});


/* Including this code from learnDot. I did not set up a Mandrill account.
function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
  var message = {
      "html": message_html,
      "subject": subject,
      "from_email": from_email,
      "from_name": from_name,
      "to": [{
              "email": to_email,
              "name": to_name
          }],
      "important": false,
      "track_opens": true,    
      "auto_html": false,
      "preserve_recipients": true,
      "merge": false,
      "tags": [
          "Fullstack_Tumblrmailer_Workshop"
      ]    
  };
  var async = false;
  var ip_pool = "Main Pool";
  mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
              
  }, function(e) {
      // Mandrill returns the error as an object with name and message keys
      console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
*/
