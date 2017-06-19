$.ajax({url: "/api/questions", method: "GET"})
.done(function(data) {
	generateQuestions($.parseJSON(data));
});

$("#submitbtn").on("click", function(){
	if (validateForm()) {
			var userData = {
				name: $("#name").val(),
				photo: $("#photo").val(),
				scores: [$("#q1").val(), $("#q2").val(), $("#q3").val(), $("#q4").val(), $("#q5").val(),
								$("#q6").val(), $("#q7").val(), $("#q8").val(), $("#q9").val(), $("#q10").val()]
			}
			var currentURL = window.location.origin;

			$.post(currentURL + "/api/friends", userData, function(data){
				console.log(data);
				$("#matchName").text(data.name);
				var subject = `New%20Friend%20From%20Friend%20Finder: (${data.name})`;
				$("#matchEmail").attr('href',`mailto:${data.email}?Subject=${subject}`)
					.text(data.email);
				$('#matchImg').attr("src", data.photo);
				$("#resultsModal").modal('toggle');
			});
	} else {
		alert("Please fill out all fields before submitting!");
	}
	return false;
});
$('.validate').click(function(){
	$(this).removeClass('validate');
});
function validateForm() {
	var isValid = true;
	if (!$('#name').val()){
		$('#name').addClass('validate')
			.click(function(){$(this).removeClass('validate')});
		isValid = false;
	};
	if (!$('#email').val()){
		$('#email').addClass('validate')
			.click(function(){$(this).removeClass('validate')});
		isValid = false;
	};
	if (!$('#photo').val()){
		$('#photo').addClass('validate')
			.click(function(){$(this).removeClass('validate')});
		isValid = false;
	};
	$('input[type="hidden"]').each(function() {
		if ( $(this).val() === '' ){
			$(this).parent().addClass('validate')
			.click(function(){$(this).removeClass('validate')});
			isValid = false;
		};
	});
	return isValid;
};

function generateQuestions(data){
	$('#questions').html('');
	var forID = 0;
	for ( i = 0 ; i < data.length ; i++ ){
		var num = i + 1;
		var $row = $('<div>', {"class": "row"});
		var $number = $('<div>', {html: num, "class": "number"});
		var $qtext = $('<div>', {html: data[i], "class": "qtext"});
		var $starsblock = $('<div>', {"class": "starsblock"});
		var $value = $('<span>', {id: 'value' + num, class: 'ans-val hide'});
		var $rating = $('<fieldset>', {id: 'question' + num, "class": "rating"});
		$('<input>').attr({type: 'hidden', id: 'q' + num,'data-number': num}).appendTo($rating);
		for ( j = 10 ; j > 0 ; j-- ){
			forID++;
			var val = j / 2;
			var lblClass = j % 2 == 0 ? 'starlbl full' : 'starlbl half';
			var elemID = 's' + forID;
			var radio = {type: 'radio', id: elemID, name: 'rating' + num, value: val};
			if(val === 5){val = 'Strongly Agree - 5'};
			if(val === 0.5){val = 'Strongly Disagree - 0.5'};
			var lbl = {class: lblClass, for: elemID, title: val};
			$('<input>').attr(radio).appendTo($rating);
			$('<label>').attr(lbl).appendTo($rating);
		};
		$rating.bind('change', function(){
			var $question = $(this).find("input[type='hidden']");
			var qNo = $question.attr('data-number');
			$question.val($('input[name=rating' + qNo + ']:checked', '#question' + qNo).val());
			var rate = parseFloat($question.val()).toFixed(1);
			$('#value' + qNo).html(rate).removeClass('hide');
		})
		$starsblock.append($rating);
		$row.append($number, $qtext, $value, $starsblock);
		$('#questions').append($row)
	};
};