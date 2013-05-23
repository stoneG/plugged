function Feed() {
  var instagramAPI = 'https://api.instagram.com/v1/tags/',
    INSTAGRAM_CLIENT_ID = '6af72c43fde348a59883d56e34f1ec74',
    tag = location.search.slice(1,-1),
    entries = [];

  entries.created_time = 0;

  this.init = function() {
  };

  this.update = function() {
    var i, photo, displayDivs, div,
      oldest_entry = function() {
        if (entries.id !== undefined) {
          return '&min_id=' + entries.id;
        }
      };
    console.log('Currently ' + entries.length + ' photos in queue');
    if (entries.length <= 30) {
      $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: instagramAPI + tag + '/media/recent?client_id=' + INSTAGRAM_CLIENT_ID,
        success: function(data) {
          for (var i = 0; i < data.data.length; i++) {
            if (entries.created_time >= +data.data[i].created_time) {
              continue;
            } else {
              entries.push(data.data[i]);
            }
          }
          if (entries.created_time < +data.data[data.data.length-1].created_time) {
            entries.created_time = +data.data[data.data.length-1].created_time; // newest created_time
          }
          console.log(entries.created_time);
        }
      });
    }
    if (entries.length > 3) {
      delete entries.shift();
      i = 0;
      displayDivs = ['past', 'present', 'future']
      while (i < 3) {
        photo = document.createElement('img');
        caption = document.createElement('p');
        photo.src = entries[i].images.standard_resolution.url;
        if (entries[i].caption !== null) {
          caption.innerHTML = entries[i].caption.text;
        }
        div = document.getElementById(displayDivs[i])
        div.innerHTML = '';
        div.appendChild(photo);
        div.appendChild(caption);
        i++;
      }
    }
  };
}

$(document).ready(function() {
  window.feed = new Feed();
  window.feed.init();
  window.feed.update();
  window.setInterval(window.feed.update, 5000);
});
