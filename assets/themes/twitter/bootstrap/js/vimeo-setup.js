//on document ready
$(function(){
	$.vimeo.init({
		resource : 'channel', // <-- set this to either album or channel
		id : 'vimeohq' // <-- set this to either the numerical id or named path to your channel or album
	});
});
