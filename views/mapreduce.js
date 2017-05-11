/*

The foolowings are map and reduce function we used to 
create views for gathering the semtiment results of 
each major cities in Australia

*/

/*

Map function to filter out all tagged twitter and its location

*/

function (doc) {
  var location = doc.place
  if( location == null) {
    location = doc.user.location
    if( location == null || location == "") {
      location = "other"
    }
  } else {
    if( location.name == "" || location.name == null ) {
      location = "other"
    }
  }
  if(doc.tag) {
    emit(String(location), String(doc.tag))
  }
  else {
    emit(String(location), "no_tag")
  }
}

/*

Reduce function used to sum up all sentiments results for each Australia's major cities

*/

function (keys, values, rereduce) {
  
  if (rereduce == true) {
    var dict = {}
    var sentimentResult = ["neu", "pos", "neg", "compound"]
    
    var major_city = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    
    for(var i = 0; i < major_city.length; i++) {
      dict[major_city[i]] = {"neu":0, "pos":0, "neg":0, "compound":0}
    }
    
    var key_set = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    for(var j = 0; j < values.length; j++) {
      for(var i = 0; i < key_set.length; i++) {
          for(var x = 0; x < sentimentResult.length; x++) {
              dict[key_set[i]][sentimentResult[x]] += values[j][key_set[i]][sentimentResult[x]]
          }
      }
    }
    return dict
  } else {
    var dict = {}
    var major_city = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    
    for(var i = 0; i < major_city.length; i++) {
      dict[major_city[i]] = {"neu":0, "pos":0, "neg":0, "compound":0}
    }
    
    for(var i = 0; i < keys.length; i++) {
      for(var j = 0; j < major_city.length; j++) {
        if (keys[i][0].toLowerCase().search(major_city[j]) >= 0) {
          if (values[i] != "no_tag") {
            dict[major_city[j]][values[i]] += 1
            break
          } else {
            break
          }
        }
      }
    }
    return dict
  }
}

/*

The followings are the Map and reduce functions we used to filter out the
tweets above the crime score base line and the reduce function will sum up
the number of tweets which have score above the crime score base line.

*/


/*

The map function, filter out the tweets above crime score base line
in there it is 0.01 and get their location as well.

*/



function (doc) {
  if (doc.final_socre >= 0.01){
    emit(doc.location, doc.final_socre)
  }
}

/*

The reduce function sum up the number of tweets which have above
crime base line scores grouped by the Australia's major cities.

*/


function (keys, values, rereduce) {
  
  if (rereduce == true) {
    var dict = {}
    var sentimentResult = ["neu", "pos", "neg", "compound"]
    
    var major_city = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    
    for(var i = 0; i < major_city.length; i++) {
      dict[major_city[i]] = {"neu":0, "pos":0, "neg":0, "compound":0}
    }
    
    var key_set = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    for(var j = 0; j < values.length; j++) {
      for(var i = 0; i < key_set.length; i++) {
          for(var x = 0; x < sentimentResult.length; x++) {
              dict[key_set[i]][sentimentResult[x]] += values[j][key_set[i]][sentimentResult[x]]
          }
      }
    }
    return dict
  } else {
    var dict = {}
    var major_city = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    
    for(var i = 0; i < major_city.length; i++) {
      dict[major_city[i]] = {"neu":0, "pos":0, "neg":0, "compound":0}
    }
    
    for(var i = 0; i < keys.length; i++) {
      for(var j = 0; j < major_city.length; j++) {
        if (keys[i][0].toLowerCase().search(major_city[j]) >= 0) {
          if (values[i] != "no_tag") {
            dict[major_city[j]][values[i]] += 1
            break
          } else {
            break
          }
        }
      }
    }
    return dict
  }
}
