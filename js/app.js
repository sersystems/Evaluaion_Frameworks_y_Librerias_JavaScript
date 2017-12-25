$(document).ready(function(){
 	
 	animarTitulo();
 	
 	$('.btn-reinicio').on('click', function(){
 		$('#score-text').text('0');
		animarReinicio();
 		colocarElementos();
 		iniciarTiempo(00, 1);
 	});

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


	function animarReinicio(){
 		$('.btn-reinicio').text('Reiniciar');
 		$('.finJuego').remove();
 		$('.score').css('margin-bottom','0%');
		$('.moves').css('margin-top','0%');
		$('.panel-tablero').css({width: '70%', height: '100%'});
		$('.panel-tablero').show();
		$('.panel-score').css({width: '25%'});
		$('.time').show();
	}


	function colocarElementos(){
		for (var i=1; i<8; i++){
			columna = ".col-"+i;
			$(columna).empty();
			for (var j=1; j<8; j++){
				numero = Math.round(Math.random() * (4 - 1) + 1);
				idElemento = 'item'+numero+'-col'+i+'fila'+j;
    			$(columna).append('<img id="'+idElemento+'" src="image/'+numero+'.png" alt="Elemento" hidden>');
    			$('#'+idElemento).addClass('elemento');
    			$('#'+idElemento).addClass('ui-widget-content');
     			$('#'+idElemento).toggle();
     			$('#'+idElemento).draggable({
     				connectToSortable: '#'+idElemento,
				    helper: "clone"
				    //revert: "invalid"
     			});
    		}
		}
		buscarCoincidencia();
	}


	function buscarCoincidencia(){
		var matrizElementos = [];
	  	for (var i=0; i<7; i++) {
	  		var subElementos = [];
	  		$('.col-'+(i+1)+' img').each(function(){
   				subElementos.push($(this).attr('id'));
	   		});
	   		matrizElementos.push(subElementos);
	  	}

		for (var i=0; i<7; i++) {
			for (var j=0; j<5; j++) {
	  			y_itemAnterior = matrizElementos[i][j].substr(0, 5);
	  			y_itemActual = matrizElementos[i][j+1].substr(0, 5);
	  			y_itemSiguiente = matrizElementos[i][j+2].substr(0, 5);
	  			//Marcar elementos para combinar de manera vertical
				if (y_itemActual == y_itemAnterior && y_itemActual == y_itemSiguiente) {
					$('#'+matrizElementos[i][j]).attr('alt','COMBINAR');
					$('#'+matrizElementos[i][j+1]).attr('alt','COMBINAR');
					$('#'+matrizElementos[i][j+2]).attr('alt','COMBINAR');
				}
			}
		}

		for (var i=0; i<7; i++) {
			for (var j=0; j<5; j++) {
	  			x_itemAnterior = matrizElementos[j][i].substr(0, 5);
	  			x_itemActual = matrizElementos[j+1][i].substr(0, 5);
	  			x_itemSiguiente = matrizElementos[j+2][i].substr(0, 5);
	  			//Marcar elementos para combinar de manera horizontal
				if (x_itemActual == x_itemAnterior && x_itemActual == x_itemSiguiente) {
					$('#'+matrizElementos[j][i]).attr('alt','COMBINAR');
					$('#'+matrizElementos[j+1][i]).attr('alt','COMBINAR');
					$('#'+matrizElementos[j+2][i]).attr('alt','COMBINAR');
				}
			}
		}
		resaltarElementos();
	}


	function resaltarElementos(){
		var reEjecutar = false;
	  	$('img').each(function(index){
 			if ($(this).attr('alt') == 'COMBINAR') {
				$(this).animate({'opacity':'0.5', 'width':'-=50px'}, 200, function(){
					$(this).animate({'opacity':'1', 'width':'+=50px'}, 200, function(){
						$(this).animate({'opacity':'0.5', 'width':'-=50px'}, 200, function(){
							$(this).animate({'opacity':'1', 'width':'+=50px'}, 200, function(){
								$(this).animate({'opacity':'0.5', 'width':'-=50px'}, 200, function(){
									$(this).animate({'opacity':'1', 'width':'+=50px'}, 200, function(){
										$(this).animate({'opacity':'0.5', 'width':'-=50px'}, 200, function(){
											$(this).animate({'opacity':'1', 'width':'+=50px'}, 200, function(){
												numero = Math.round(Math.random() * (4 - 1) + 1);
												idElemento = 'item'+numero+$(this).attr('id').substr(5, $(this).attr('id').length);
												$(this).attr('src','image/'+numero+'.png');
												$(this).attr('alt','Elemento');
												$(this).attr('id',idElemento);
												if($('#timer').text() != '00:00'){
													puntos = parseInt($('#score-text').text())+10;
													$('#score-text').text(puntos);
												}
											})
										});
									})
								});
							})
						});
					})
				});
				reEjecutar = true;
 			}
	   	});	
	   	timerReBuscarCoincidencia = window.setTimeout(function(){reBuscarCoincidencia(reEjecutar);}, 3500);
	}	

	function reBuscarCoincidencia(indicador){
 		if (typeof(timerReBuscarCoincidencia) == 'number') clearTimeout(timerReBuscarCoincidencia);
		if(indicador){
			buscarCoincidencia();
		}
	}

	function iniciarTiempo(minInicial, segInicial){
		var minutos = parseInt(minInicial);
		var segundos = parseInt(segInicial);
 		if (typeof(timerCuenta) == 'number') clearInterval(timerCuenta);
 		$('#timer').text(numeral(minutos)+':'+numeral(segundos));

	 	timerCuenta = window.setInterval(function(){
			if (minutos >0 && segundos == 0) {
				minutos -= 1;
				segundos = 59;
				if (minutos < 0) {
					minutos = 0;
				}
			}	
			if (minutos <= 0 && segundos < 0) {
				clearInterval(timerCuenta);
				if (typeof(timerTablero) == 'number') clearTimeout(timerTablero);
				timerTablero = window.setTimeout(function(){
					$('.panel-tablero').animate({width: '0px', height: '0px'}, 1000, function(){
						$(this).hide();
					});					
					$('.panel-score').animate({width: '100%'}, 1000, function(){
						$(this).append('<div class="finJuego"><h1 class="titulo-over">Juego Terminado</h1></div>');
						$('.finJuego').insertBefore(this);
						$('.score').css('margin-bottom','-18%');
						$('.moves').css('margin-top','-18%');
					});
					$('.time').toggle(1000);
				}, 1000);
			}else{
				$('#timer').text(numeral(minutos)+':'+numeral(segundos));
				segundos -= 1;
			}	
		}, 1000);

	 	function numeral(numero){
	 		var formato = (numero <10)? '0'+numero : numero;
	 		return formato;
	 	}
	}