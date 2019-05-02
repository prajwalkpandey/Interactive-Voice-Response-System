/*
 *Made By: Yashasvi Goel
 *Contact: yashasvigoel@gmail.com
 *Dated:20/4/19
 *Please do not mind the spelling errors; They were intentionaly made to enhance the pronunciation
 */
var http=require('http');
var url=require('url');
var obj=[];
http.createServer(function(req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	var q=url.parse(req.url,true).query;//creates an object having all the request parameters from the URL
	var sid=q.sid;//unique ID of Call
	var eve=q.event;//event type
	var newC="NewCall";//will use for comparision
	var dtmf="GotDTMF";//will use for comparision
	if(eve!=undefined){
		if(eve.localeCompare(newC)==0){ //identifies new call
			var temp={"sid":sid, "count":1, "gender":""};
			obj.push(temp);
			console.log("Event "+q.event+"\n"+"SID "+q.sid+"\ncalled_number "+q.called_number+"\nOperator "+q.operator+"\nCircle "+q.circle+"\n");
			res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"> <collectdtmf l="+"\"1\""+" t="+"\"#\""+" o="+"\"10000\""+"><playtext>Press one if you are Male,,,,, Press two if you are Fi male   </playtext></collectdtmf></response>");
		}
		else if(eve.localeCompare(dtmf)==0){ //identifies that data is being recieved
			var index=getIndex(obj,sid); //the index from array where data for this call is being stored
			console.log("Data recieved from "+q.sid+" is "+q.data);
			k=q.data;
			if(obj[index].count==1){ //storing data for the first time
				obj[index].gender=(k==1)?"Male":"Female";
				obj[index].count+=1;
				console.log(obj[index].sid+" "+obj[index].gender+" "+obj[index].count);
				if(k==2){
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"> <collectdtmf l="+"\"1\""+" t="+"\"#\""+" o="+"\"10000\""+"><playtext>If you are above eighteen years of age press one, else press two   </playtext></collectdtmf></response>");
				}
				else if(k==1){
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"> <collectdtmf l="+"\"1\""+" t="+"\"#\""+" o="+"\"10000\""+"><playtext>If you are above twenty one years of age press one, else press to    </playtext></collectdtmf></response>");
				}
				else{
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"><playtext>You have entered an invalid choice</playtext><hangup></hangup></response>");
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"><hangup></hangup></response>");
				}
			}
			else
			{
				if(k==1){
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"><playtext>You are an Adult</playtext><hangup></hangup></response>");
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"> <hangup></hangup></response>");
					console.log(q.sid+" is an adult.\n Congrats");
				}
				else if(k==2){
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"><playtext>Minors are not allowed    </playtext><hangup></hangup></response>");
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"> <hangup></hangup></response>");
					console.log(q.sid+" is an minor.\n");
				}
				else{
					res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"><playtext>You have entered an invalid choice   </playtext><hangup></hangup></response>");
			//		res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"><hangup></hangup></response>");
				}
			}
		}
		else{
			res.end("<?xml version=\""+"1.0"+"\" encoding=\""+"UTF-8"+"\"?><response sid=\""+q.sid+"\"><hangup></hangup></response>");
			console.log(eve);
		}
	}
}).listen(7878);



function getIndex(arr,sid){//returns index of object from arr where 'sid' is the sid
	return pos=arr.map(function(e){return e.sid;}).indexOf(sid) ;
}
