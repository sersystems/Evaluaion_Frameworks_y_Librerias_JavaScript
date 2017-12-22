$(document).ready(function(){
 
	animarTitulo();

});

	function animarTitulo(){
		var time1 = Math.round(Math.random() * (600 - 100) + 100);
		var time2 = Math.round(Math.random() * (600 - 100) + 100);
		$(".main-titulo").animate({'color':'white'}, time1, function(){
			$(".main-titulo").animate({'color':'yellow'}, time2, function(){
				animarTitulo();
			});
	  	});
	}
