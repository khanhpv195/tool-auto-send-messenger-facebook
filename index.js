(() => {
	const msgs = ['I love you'];
	const messageLimit = 10;
	
	var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
	var getConversations = (fb_dtsg, c_callback) => {
		var c_xhr	= new XMLHttpRequest;
		var c_data	= new FormData();
		c_data.append('fb_dtsg', fb_dtsg);
		var queries = {
			"o0": {
				"doc_id": "1475048592613093",
				"query_params": {
					"limit": messageLimit,
					"tags": ["INBOX"],
					"includeDeliveryReceipts": true,
					"includeSeqID": false
				}
			}
		}
		c_data.append('queries', JSON.stringify(queries));
		c_xhr.onreadystatechange = () => {
			if (c_xhr.readyState == 4 && c_xhr.status == 200) c_callback(JSON.parse(c_xhr.responseText.split('\n')[0])['o0'].data.viewer.message_threads.nodes);
		}
		c_xhr.open('POST', '/api/graphqlbatch/');
		c_xhr.send(c_data);
	}
	var sendMessage = (fb_dtsg, mmsg, uuid) => {
		var formData = new FormData();
		formData.append("ids["+uuid+"]", uuid);
		formData.append("body", mmsg);
		formData.append("fb_dtsg", fb_dtsg);
		var r = new XMLHttpRequest;
		r.onreadystatechange = () => {
			if (r.readyState == 4 && r.status == 200) {
				console.log('Message was sent to [' + uuid + ']');
			}
		}
		r.open('POST', 'https://m.facebook.com/messages/send/?icm=1&refid=12&ref=dbl');
		r.send(formData);
	}
	getConversations(fb_dtsg, conversations => {
		conversations.forEach(c => {
			//console.log(c);
			if (c.thread_type == 'ONE_TO_ONE') {
				var otherID = c.thread_key.other_user_id;
				//console.log(otherID);
				sendMessage(fb_dtsg, msgs[Math.floor(Math.random() * msgs.length)], otherID);
			} else {
				console.log('Auto message to Group is not allowed!');
			}
		});
	});
})();
