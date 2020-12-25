import fetch from "../util/fetch-fill";
import URI from "urijs";
const util = require('util')

window.path = "http://localhost:3000/records";
var urlfetch = function(options) {
    let urlf = URI(window.path)
    urlf.addSearch("limit",11) // limit is 11 instead of 10 to find if its last page
    if(null == options)
    {   
        return urlf
    }
    let optionsPage = options.page == null ? 1 : options.page;
    let offset = (optionsPage-1) * 10
    urlf.addSearch("offset",offset)
    if(options.colors != null)
        options.colors.forEach(function(e,i){
            urlf.addSearch("color[]",e)
    })
    return urlf.normalize()
}

function retrieve(options) { 
    let urlf = urlfetch(options)
    let optionsPage = options == null || options.page == null ? 1 : options.page;
    let ret = {
        previousPage: optionsPage == 1 ? null : optionsPage-1,
        nextPage: optionsPage+1,
        ids:  [],
        open: [],
        closedPrimaryCount: 0
    }
   return fetch(urlf).
   then(function(res) {
    return res.json();
   }).then(function(json) {
       let ids
       let lastPage=true;
       json.forEach(function(e,i) { 
           if(i==10) { // limit is 11 instead of 10 to find if its last page
               lastPage=false;
               return;
           }
           ret.ids.push(e.id)
           if(e.color == 'red'|| e.color == 'blue'|| e.color == 'yellow' ) {
               e.isPrimary=true
               if(e.disposition == 'closed') {
                ret.closedPrimaryCount++;
               }
           } else {
                e.isPrimary=false
           }
           if(e.disposition == 'open') {
               ret.open.push(e);
           }
       })
       if(lastPage)
        ret.nextPage= null
       return ret
   })
   .catch(function(err) {
      console.log("Error Occured:")
      console.log(util.inspect(err, false, null, true))
    })
}
export default retrieve;