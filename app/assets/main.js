import 'jquery';
import '@assets/scss/all.scss';

let count = 0;

document.getElementById('count').innerText = count;

$('#btn').on('click',()=>{
  count += 1;
  $( '#count' ).text(count)
})