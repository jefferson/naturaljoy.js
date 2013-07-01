naturaljoy.js
===============

Natural Slide Javascript

Primeiro adicione teste código html na sua página
Possui dependências com jquery-ui e jquery para arrastasr as controles

Código html
==============
	<div id="data-root-webcam">
		<div class="well sidebar-nav" style="height:200px">          
	  <div id="paleta-esquerda" class="paleta"> </div>
	  <div id="paleta-direita" class="paleta"> </div>
	  <video id="camera" autoplay style="display:none" width="200" height="200"></video>
	  <canvas id="canvas-source"  width="200" height="200" class="img-polaroid span12"></canvas>
	  <canvas id="canvas-blended" style="display:none" width="200" height="200"></canvas>          
	</div><!--/.well --> 
	</div>

Como usar o código javascript
===============



   
     var _left = parseInt($("#canvas-source").position().left)
     var _top  = parseInt($("#canvas-source").position().top)

     var _paleta_esquerda_top  = parseInt($("#paleta-esquerda" ).position().top - _top)
     var _paleta_esquerda_left = parseInt($("#paleta-esquerda" ).position().left - _left )

     var _paleta_direita_top  = parseInt($( "#paleta-direita" ).position().top - _top)
     var _paleta_direita_left = parseInt($( "#paleta-direita" ).position().left - _left)

    function atualizaPosicoes(){
  		
			NaturalJoy.actionClean();
			
			NaturalJoy.actionPush(function(){

				console.log('ação esquerda detectada')							

			}, _paleta_esquerda_left, _paleta_esquerda_top , 25, 25);

			NaturalJoy.actionPush(function(){ 			

				console.log('ação direita detectada')			

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
