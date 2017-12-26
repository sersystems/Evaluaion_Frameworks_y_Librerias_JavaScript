$(document).ready(function(){
 	
 	animarTitulo();
 	
 	$('.btn-reinicio').on('click', function(){
 		$('#score-text').text('0');
 		$('#movimientos-text').text('0');
		animarReinicio();
 		colocarElementos();
 		iniciarTiempo(02, 00);
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
 		$('.score').css('margin-bottom','0px');
		$('.moves').css('margin-top','0px');
		$('.panel-tablero').css({width: '70%', height: '100%'});
		$('.panel-tablero').show();
		$('.panel-score').css({width: '25%'});
		$('.time').show();
	}


	function colocarElementos(){
		for (var i=1; i<8; i++){
			columna = ".col-"+i;
			$(columna).empty();
			$('.col-1').css({'margin-left':'-20px'});
			$(columna).append('<ul id="listaDeElementos'+i+'" class="ui-sortable"></ul>');
			for (var j=1; j<8; j++){
				numero = Math.round(Math.random() * (4 - 1) + 1);
				idElemento = 'item'+numero+'-col'+i+'fila'+j;
    			$('#listaDeElementos'+i).append('<li id="'+idElemento+'" class="ui-sortable-handle"><img src="image/'+numero+'.png" alt="Elemento"></li>');
				$('li').css({'list-style-type':'none', 'float':'center', 'width':'auto', 'height':'auto'});
    		}
		}
		$('li img').addClass('elemento');
		$('li img').css("cursor","move");
		$('ul').sortable({tolerance: 'pointer'});
        $('li img').droppable({drop: function(event, ui){
			if($('#moves').text() != '0'){
				movimientos = parseInt($('#movimientos-text').text())+1;
				$('#movimientos-text').text(movimientos); 
			}	        	
	   		timerReBuscarCoincidencia = window.setTimeout(function(){reBuscarCoincidencia(true);}, 250);
        }});
		buscarCoincidencia();

	}


	function buscarCoincidencia(){
		var matrizElementos = [];
	  	for (var i=0; i<7; i++) {
	  		var subElementos = [];
	  		$('#listaDeElementos'+(i+1)+' li').each(function(){
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
					$('#'+matrizElementos[i][j]+' img').attr('alt','COMBINAR');
					$('#'+matrizElementos[i][j+1]+' img').attr('alt','COMBINAR');
					$('#'+matrizElementos[i][j+2]+' img').attr('alt','COMBINAR');
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
					$('#'+matrizElementos[j][i]+' img').attr('alt','COMBINAR');
					$('#'+matrizElementos[j+1][i]+' img').attr('alt','COMBINAR');
					$('#'+matrizElementos[j+2][i]+' img').attr('alt','COMBINAR');
				}
			}
		}
		resaltarElementos();
	}


	function resaltarElementos(){
		var reEjecutar = false;
	  	$('li').each(function(index){
	  		var identificador = '#'+$(this).attr('id')+' img';
 			if ($(identificador).attr('alt') == 'COMBINAR') {
 				var idTimer = $(this).attr('id');
 				colocarEfecto(idTimer, identificador);
 			}
	   	});	
	   	
	   	function colocarEfecto(idTimer, identificador){
	   		var contadorEfecto = 3;
	   		var timerEfecto = 'timer'+idTimer;
		 	(timerEfecto) = window.setInterval(function(){
	 	 		$(identificador).animate({
					'opacity':'0.5',
			 	 	'width':'-=50px'
			 	}, 200, function(){$(identificador).animate({
			 	 	'opacity':'1',
			 	 	'width':'+=50px'
			 	}, 200, function(){
		 			contadorEfecto -= 1;
			 		if (contadorEfecto == 0) {
 						redefinirElemento(identificador);
						clearInterval((timerEfecto));
			 		}
			 	})});
 	 		}, 500);
	   	}

	   	function redefinirElemento(identificador){
				reEjecutar = true;
	   			elemento = identificador.substr(0, identificador.length-4);
				numero = Math.round(Math.random() * (4 - 1) + 1);
				idElemento = 'item'+numero+$(elemento).attr('id').substr(5, $(elemento).attr('id').length);
				$(identificador).attr('src','image/'+numero+'.png');
				$(identificador).attr('alt','Elemento');
				$(elemento).attr('id',idElemento);
				if($('#timer').text() != '00:00'){
					puntos = parseInt($('#score-text').text())+10;
					$('#score-text').text(puntos); 
				}	   		
	   	}
	   	timerReBuscarCoincidencia = window.setTimeout(function(){reBuscarCoincidencia(reEjecutar);}, 2500);
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
						$(this).append('<div id="panelTituloFinal"><h1 class="titulo-over">Juego Terminado</h1></div>');
						$('#panelTituloFinal').addClass('finJuego');
						$('#panelTituloFinal').insertBefore(this);
						$('.score').css('margin-bottom','-50px');
						$('.moves').css('margin-top','-50px');
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