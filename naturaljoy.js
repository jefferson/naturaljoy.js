"use strict";

(function(){
  
navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.requestAnimationFrame = window.webkitRequestAnimationFrame ||  window.mozRequestAnimationFrame;

window.NaturalJoy = {

   webcam:{
       lastImageData: null,
       canvasOriginal: null,
       canvasDiferenca:null,
       contextOriginal: null,
       contextDiferenca:null,
       quadrantes: [],
       video: document.querySelector('video'),
       sinal: false ,
       sinalBtn:false,
       VideoStream: null
     },
     propriedades:{
      rootElement: document.querySelector("div#data-root-webcam"), 
      finish :false,
      fullscreen: false,
      pause: false,
      sensibilidade: 1,
      intensidade: 21,
      myWindow:false
     },     
     initialize: function(){

        var _that = this;     

//        this.adicionarElementos();

        //modificações da camera
        this.webcam.canvasSource     = document.querySelector("#canvas-source"),
        this.webcam.canvasDiferenca  = document.querySelector("#canvas-blended"),
        this.webcam.contextOriginal  = this.webcam.canvasSource.getContext('2d'),
        this.webcam.contextDiferenca = this.webcam.canvasDiferenca.getContext('2d'),
       
        this.webcam.contextOriginal.translate(this.webcam.canvasSource.width, 0);
        this.webcam.contextOriginal.scale(-1, 1);

     },
     adicionarElementos: function(){

        //<video id="camera" autoplay style="display:none" width="140" height="140"></video>
        //<canvas id="canvas-source"  width="140" height="140" class="img-polaroid span12"></canvas>
        //<canvas id="canvas-blended" style="display:none" width="140" height="140"></canvas>

        this.webcam.video = document.createElement('video');
        this.webcam.video.id = "camera";
        this.webcam.video.autoplay = true;
        this.webcam.video.style.display = 'none';
        this.webcam.video.style.width = '140px';
        this.webcam.video.style.height = '140px';

        this.webcam.canvasSource = document.createElement('canvas');
        this.webcam.canvasSource.id = "canvas-source";
        this.webcam.canvasSource.style.width = '140px';
        this.webcam.canvasSource.style.height = '140px';

        this.webcam.canvasDiferenca = document.createElement('canvas');
        this.webcam.canvasDiferenca.id = "canvas-blended";
        this.webcam.canvasDiferenca.style.display = 'none';
        this.webcam.canvasDiferenca.style.width = '140px';
        this.webcam.canvasDiferenca.style.height = '140px';

        this.propriedades.rootElement.appendChild(this.webcam.video);
        this.propriedades.rootElement.appendChild(this.webcam.canvasSource);
        this.propriedades.rootElement.appendChild(this.webcam.canvasDiferenca);

     },
     LoadingVideo: function(){
        
       NaturalJoy.start();
  
     },
     actionClean: function(){
       this.webcam.quadrantes = [];
     },
     actionPush: function(act, Px, Py, Pw, Ph){
       
       this.webcam.quadrantes.push({action: function(){act()},ready:true, area: {x:Px, y:Py, width:Pw, height:Ph}});
       
     },
     update: function(){

       NaturalJoy.drawVideo();
       NaturalJoy.functionDiferenca();
       NaturalJoy.verificarAreas();        
       window.requestAnimationFrame(NaturalJoy.update);       
       
     },
     drawVideo: function(){
      
        try{
          NaturalJoy.webcam.contextOriginal.drawImage(NaturalJoy.webcam.video, 0, 0, NaturalJoy.webcam.video.width, NaturalJoy.webcam.video.height); 
        }catch(e){

          setTimeout(function(){
              NaturalJoy.webcam.contextOriginal.drawImage(NaturalJoy.webcam.video, 0, 0, NaturalJoy.webcam.video.width, NaturalJoy.webcam.video.height); 
          }, 300)       
        }


     },
     functionDiferenca: function(){
        
        var width = this.webcam.canvasSource.width;
        var height = this.webcam.canvasSource.height;
        // get webcam image data
        var sourceData = this.webcam.contextOriginal.getImageData(0, 0, width, height);
        // create an image if the previous image doesn’t exist
        if (!this.webcam.lastImageData) this.webcam.lastImageData = this.webcam.contextOriginal.getImageData(0, 0, width, height);
        // create a ImageData instance to receive the blended result
        var blendedData = this.webcam.contextOriginal.createImageData(width, height);
        // blend the 2 images
        this.verificandoDiferencas(blendedData.data, sourceData.data, this.webcam.lastImageData.data);
        // draw the result in a canvas
        this.webcam.contextDiferenca.putImageData(blendedData, 0, 0);
      
        // store the current webcam image
        this.webcam.lastImageData = sourceData;

     },
     valorAbsoluto: function(value){
          
        // equivalent to Math.abs();
        return (value ^ (value >> 31)) - (value >> 31);

     },
     verificandoDiferencas: function(target, data1, data2){
        
       if (data1.length != data2.length) return null;

       var i = 0;

       while (i < (data1.length * 0.25)) {
         var average1 = (data1[4*i] + data1[4*i+1] + data1[4*i+2]) / 3;
         var average2 = (data2[4*i] + data2[4*i+1] + data2[4*i+2]) / 3;
         var diff = this.limiar(this.valorAbsoluto(average1 - average2));
         target[4*i] = diff;
         target[4*i+1] = diff;
         target[4*i+2] = diff;
         target[4*i+3] = 0xFF;
         ++i;
       }
        
     },
     limiar: function(value){
       
         return (value > NaturalJoy.propriedades.intensidade) ? 0xFF : 0;

     },
     verificarAreas: function(){
     
        if(!this.propriedades.pause)
        for (var r=0; r < this.webcam.quadrantes.length; ++r) {

         var blendedData =  this.webcam.contextDiferenca.getImageData(
           this.webcam.quadrantes[r].area.x,
           this.webcam.quadrantes[r].area.y,
           this.webcam.quadrantes[r].area.width,
           this.webcam.quadrantes[r].area.height
         );
         
         var i = 0;
         var media = 0;

         while (i < (blendedData.data.length / 4)) {
         
           media += (blendedData.data[i*4] + blendedData.data[i*4+1] + blendedData.data[i*4+2]) / 3;
           ++i;

         }

         media = Math.round(media / (blendedData.data.length / 4));
         
         if ( media > NaturalJoy.propriedades.sensibilidade ) {
            
           if( this.webcam.sinal ){
                this.webcam.quadrantes[r].action();
                this.webcam.sinal = false;
                setTimeout(function(){ NaturalJoy.webcam.sinal = true },2000);
           }

         }

       }           
     },
     pause: function() {

       this.propriedades.pause = true;

     },
     start: function() {

       this.update();

     },
     stop: function(){
       
          this.webcam.sinal = false;
          this.propriedades.pause = false;
          this.webcam.VideoStream.stop();
     },
     play: function(){
          
          if( this.propriedades.pause){

             this.propriedades.pause = false
             return;

          }
          
          NaturalJoy.webcam.sinal = false;

          //bug ao iniciar a camera - delay
          setTimeout(function(){ 

            NaturalJoy.webcam.sinal = true 

          },5000);
            
          var camNotAutorized = function(e) {
              console.log('Acesso Negado', e);
          };

          // Not showing vendor prefixes.
          navigator.getUserMedia({video: true}, function(localVideoStream) {
              
              NaturalJoy.webcam.video.src = window.URL.createObjectURL(localVideoStream);
              NaturalJoy.webcam.video.mozSrcObject = localVideoStream;
              NaturalJoy.LoadingVideo();
              NaturalJoy.webcam.VideoStream = localVideoStream;  
              
              NaturalJoy.webcam.video.onloadedmetadata = function(e) {
                console.log("onloademetadata",e)
                // Ready to go. Do some stuff.
              };

          }, camNotAutorized);

     }
}


})(window, navigator);
