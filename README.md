naturalslide.js
===============

Natural Slide Javascript


Como usar
===============


function atualizaPosicoes(){
  		//action , x, y, w ,h
			NaturalJoy.actionClean();
			
			NaturalJoy.actionPush(function(){

				console.log('esquerda')

				$("#paleta-esquerda").css('background-color', 'red')

				olhos.classList.add('animado');

				setTimeout(function(){
					
					$("#paleta-esquerda").css('background-color', 'green')						
					
					cubo.style.display = "block"					
					olhos.classList.remove('animado');
					$("div#on-off").click()

					setTimeout(function(){

						cubo.style.display = "none"

					}, 200)


				}, 2000)

				$("div#on-off").click()

			}, _paleta_esquerda_left, _paleta_esquerda_top , 25, 25);

			NaturalJoy.actionPush(function(){ 			

				console.log('direita')

				$("#paleta-direita").css('background-color', 'red')
				olhos.classList.add('animado');
				setTimeout(function(){

					$("#paleta-direita").css('background-color', 'green')						
					cubo.style.display = "block"					
					olhos.classList.remove('animado');
					$("div#on-off").click()


					setTimeout(function(){

						cubo.style.display = "none"

					}, 200)

				}, 2000)

				$("div#on-off").click();

			},  _paleta_direita_left, _paleta_direita_top, 25, 25);

		}

		//marcando as posicoes
		atualizaPosicoes()

		$( "#paleta-esquerda" ).draggable({stop: function(){
			_paleta_esquerda_top  = parseInt($(this).position().top - _top)
			_paleta_esquerda_left = parseInt($(this).position().left - _left)
			atualizaPosicoes()

		}, containment: "#canvas-source", grid: [ 1,1 ]} );

		$( "#paleta-direita" ).draggable({stop: function(){
			_paleta_direita_top  = parseInt($(this).position().top - _top)
			_paleta_direita_left = parseInt($(this).position().left - _left)
			atualizaPosicoes()
		},containment: "#canvas-source",  grid: [ 1,1 ]});


		window.NaturalJoy.initialize();
		window.NaturalJoy.play();		
