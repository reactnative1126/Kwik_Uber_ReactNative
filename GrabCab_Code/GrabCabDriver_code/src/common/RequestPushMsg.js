import  languageJSON  from './language';
export function RequestPushMsg(token,msg,bookingId){
    console.log('param=>',token,msg,)
    fetch('https://exp.host/--/api/v2/push/send', {       
        method: 'POST', 
        headers: {
              Accept: 'application/json',  
             'Content-Type': 'application/json', 
             'accept-encoding': 'gzip, deflate',   
             'host': 'exp.host'      
         }, 
       body: JSON.stringify({                 
            "to": token,                        
            "title": languageJSON.notification_title,                  
            "body": msg,  
            "data": {"msg":msg,"title":languageJSON.notification_title},          
            "priority": "high",            
            "sound":"default",   
            "channelId": "messages"  
         }),        
     }).then((response) => response.json())   
              .then((responseJson) => { 
                  return responseJson
     })
     .catch((error) => { console.log(error) });
}
    



