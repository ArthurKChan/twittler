/*
 * Contains Twittler functions and Event handlers
 *
 */

$(document).ready(function(){
  printStream(currentStream, dCount);
  updateCharCount(tweetCharacterLimit);

  /*Refresh current user feed every 3 minutes*/
  setInterval( function(){printStream(currentStream, dCount);}, 180000);
        
  /*Event handlers*/
  $(document).on('click', '#refreshFeed',function(){ printStream(currentStream,dCount);});
  $(document).on('click', '.tweetUsername', function(){
    $('body').find('#inputBlock').slideUp(500);
    currentStream = $(this).text().slice(2);
    printStream(currentStream,dCount);
  });
  $(document).on('click', '#showMore',function(){ dCount += 10; printStream(currentStream, dCount); });
  $(document).on('click', '#homeButton',function(){
    $('body').find('#inputBlock').slideDown(500);
    currentStream = 'home';
    dCount=10;
    printStream(currentStream, dCount);
  });
  $(document).on('click', '#post', function(){ postTweet(); });
  $(document).on('focus', '#tweetInput', function(){
    if($(this).val()==='Type tweet here.'){
      $(this).val('');
    }
  });
  $(document).on('focusout', '#tweetInput', function(){
    if($(this).val()===''){
      $(this).val('Type tweet here.');
    }
  });
  $('body').on('keyup', '#tweetInput', function(){ updateCharCount(tweetCharacterLimit); });

});
  
/*************Global variables***********************/
var currentStream = 'home';
var dCount = 10;
var tweetCharacterLimit = 180;
var visitor = 'anonymous';

/*************Functions**************************/

/*Post user's tweet*/
function postTweet(){
  var $msg = $('body').find('#tweetInput');
  if($msg.val().length <= 180 && $msg.val().length > 0){
    writeTweet($msg.val());
    $msg.val('');
  }
}

/*Check input tweet length & update characters left message*/
function updateCharCount(charLimit){
  var inputCount = $('body').find('#tweetInput').val().length;
  var charAvail = charLimit-inputCount;
  var $charCount = $('body').find('#charCount');
        
  if (charAvail >= 0){
    $charCount.text(charAvail + ' characters left');
  }
  else {
    $charCount.text('character limit exceeded');
  }
}
      
/*
  Appends tweets to Feed
  user - string specifies where to get tweets from
  displayCount - determines how many tweets to display
*/      
function printStream(user, displayCount){
  var $tweetFeed = $('.tweetFeed')
  $tweetFeed.html(''); //Clear feed
  var index, streamPtr, count=0;
  user === 'home' ?
  (index = streams.home.length - 1, streamPtr = streams.home ) :
  (index = (streams.users)[user].length - 1, streamPtr = (streams.users)[user] ); 
  while(index >= 0 && count < displayCount){
    var tweet = streamPtr[index];
    var $tweet = $('<div class="tweet"></div>');
          
    $tweet.append('<img class="userIcon" src="user_icons/' + tweet.user + '.jpg">');
    $tweet.append('<span class="tweetUsername">@ ' + tweet.user + '</span>');
    $tweet.append('<span class="tweetTimestamp" data-livestamp="'+ tweet.created_at +'"></span>');
    $tweet.append('<p class="tweetMsg">' + tweet.message + '</p>');

    $tweet.appendTo($tweetFeed);
    index -= 1;
    count += 1;
  }
}