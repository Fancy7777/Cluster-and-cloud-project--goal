function (keys, values, rereduce) {
  if (rereduce == true) {
    var dict = {}
    var major_city = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    
    for(var i = 0; i < major_city.length; i++) {
      dict[major_city[i]] = 0;
    }
    
    var key_set = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    for(var j = 0; j < values.length; j++) {
      for(var i = 0; i < key_set.length; i++) {
              dict[key_set[i]] += values[j][key_set[i]]
          }
      }
    }
    return dict
  } else {
    var dict = {}
    var major_city = ["adelaide", "brisbane", "canberra", "darwin", "hobart", "melbourne", "perth", "sydney"]
    
    for(var i = 0; i < major_city.length; i++) {
      dict[major_city[i]] = 0
    }
    
    for(var i = 0; i < keys.length; i++) {
      for(var j = 0; j < major_city.length; j++) {
        if (keys[i][0].toLowerCase().search(major_city[j]) >= 0) {
          if (values[i] == 1) {
            dict[major_city[j]] += 1
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