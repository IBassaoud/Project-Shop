// if my document is in the state of loading, if it is loading run the code add event listener
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded',ready)
} else { // if it's not loading (i.e already done loading) run ready fonction no matter what
  ready()
}

//So my remove function will automatically work even if is the page isn't already loaded
// because it either waits for the DOMContentLoaded event to call the function ready
function ready() {
  let removeProductButtons = document.getElementsByClassName("btn_danger")
  // console.log the variable to see what it is inside 
  // console.log(removeProductButtons)
  //For loop throught all of the different buttons inside of my shop
  for (i = 0; i < removeProductButtons.length; i++) {
    //variable that would be our button that is equal to whatever element in our array
    let button = removeProductButtons[i]
    //now we can use our button variable that correspond to our remove button in the shop
    //Add event listener to do something when button is clicked
    button.addEventListener("click", removeProductItem)
  }

  //to make the total update every time we change the quantity and prevent negative number  
  let quantityInputs = document.getElementsByClassName("prod_quantity_input")
  for (i = 0; i <quantityInputs.length; i++){
    let input = quantityInputs[i]
    //add event listener change so that every time it changes run the defined function  
    input.addEventListener("change", quantityChanged)
  }
  updateProductTotal()
}

function removeProductItem(e) {
    //store the event when the button is clicked into a variable buttonClicked
    let buttonClicked = e.target
    //indication to remove the ancestor of our button that contains the row of the product to remove
    buttonClicked.parentNode.parentNode.remove()

    //function to update our total price every time a product is removed
    updateProductTotal()
}

function quantityChanged(e) {
  //so what we want to do when our quantity changes? The first thing is to get that quantity element
  //the target of our event is going to be our input element that we need
  let input = e.target
  //then we want to check if the if the value inside of the input is a valid value
  //i.e that if it's NaN or a negative number set our input value to 1 that is the lowest number the client can order
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1
  }
  //call the function update total
  updateProductTotal()
}


//creation d'un tableau vide dans le localStorage


let imagesObject = [];
function handleFileSelect(e) {
  let files = e.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    for ( i = 0; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }
    let reader = new FileReader();
      // Closure to capture the file information.
      reader.onload = function(e) {
        displayImgData(e.target.result)
        addImage(e.target.result);
    };

    reader.readAsDataURL(f);
  }
}

function loadFromLocalStorage(){
  let images = JSON.parse(localStorage.getItem("images"))

  if(images && images.length > 0){
    imagesObject = images;
    
    displayNumberOfImgs();
    images.forEach(displayImgData);
  }
}

function addImage(imgData){
  imagesObject.push(imgData);
  displayNumberOfImgs();
  localStorage.setItem("images", JSON.stringify(imagesObject));
}

function displayImgData(imgData){
  let span = document.createElement('span');
  span.innerHTML = `<img class="thumb formin" id"prodImg" src="` + imgData + `"/>`;
  document.getElementById('myprod_img').insertBefore(span, null);
}

function displayNumberOfImgs(){
  if(imagesObject.length > 0){

    document.getElementById("state").innerHTML = imagesObject.length + " image" + ((imagesObject.length > 1) ? "s" : "") + " stored in your browser";
    
    document.getElementById("deleteImgs").style.display = "inline";
    
  } else {
    document.getElementById("state").innerHTML = "No images stored in your browser.";
    document.getElementById("deleteImgs").style.display = "none";
  }
}

function deleteImages(){
  imagesObject = [];
  localStorage.removeItem("images");
  displayNumberOfImgs()
  document.getElementById('myprod_img').innerHTML = "";
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('deleteImgs').addEventListener("click", deleteImages);
loadFromLocalStorage();

//action du bouton d'envoi
  let mybutton = document.getElementById("go");
  mybutton.addEventListener("click",manage_form)
  function manage_form() {
    //je recupère tout les inputs concernés (le formulaire)
    let mydata = document.getElementsByClassName("formin");
    //j'itèrre sur chaque element du form pour récupérer son id
    //et sa valeur pour pousser => JSON : cle : valeur
    let jsonData = {}  //cle : valeur grace au {}
    for (i=0; i<mydata.length; i++) {
      //console.log(mydata[i].id,mydata[i].value);
      jsonData[mydata[i].id] = mydata[i].value;
    }

    //je recupère les détails déjà stockés
    let myolddata = localStorage.getItem("entrepot");
    //je les transforme en JSON
    myolddata = JSON.parse(myolddata);
    //data.push(nouveau produit)
    myolddata.push(jsonData);
    //je remet le tableau dans le local storage
    localStorage.setItem("entrepot", JSON.stringify(myolddata));
    loadshop2()
    updateProductTotal()
  }
 

  // création de tableau
  function loadshop1(){
    //recupère les localstorage (et parse les)
    let mydata = JSON.parse(localStorage.getItem("entrepot"));
    let mytablecontainer = document.getElementById("mybody");
    let tableconcat = ``
  }  
  function loadshop2(){
    //recupère les localstorage (et parse les)
    let mydata = JSON.parse(localStorage.getItem("entrepot"));
    let mytablecontainer = document.getElementById("mybody");
    let tableconcat = `<table>
                        <thead>
                          <tr>
                            <td>Image</td>
                            <td>Name</td>
                            <td>Reference</td>
                            <td>Description</td>
                            <td>Inventory</td>
                            <td>Price</td>
                            <td> </td>
                          </tr>
                        </thead>
                        <tbody class="container_product">` ;
    //console.log(mydata);
    for (i=0;i<mydata.length;i++){
      tableconcat += `<tr id="products" class="prod_parent">`
      tableconcat += `<td class='prod_file prod'><img src=" "></td>
                      <td class="prod_name prod">${mydata[i].name}</td>
                      <td class="prod_ref prod">${mydata[i].ref}</td>
                      <td class="prod_desc prod">${mydata[i].desc}</td>
                      <td class="prod_inv prod">${mydata[i].inv}</td>
                      <td class="prod_price prod">${mydata[i].price} €</td>
                      <td class="prod_quantity prod">
                        <input class="prod_quantity_input" type="number" value="1">
                        <button class="btn btn_danger" type="button">REMOVE</button>
                    </td>`;
      tableconcat += "</tr>";
      //console.log(mydata[i])
    }
   
    tableconcat += `<tr><td id="total_price" colspan="7">Total : 25 €</td></tr>
                        <tr><td colspan="7"><button class="btn btn_primary btn_purchase" type="button">PURCHASE</button></td></tr>`;
    tableconcat += `    </tbody>
                      </table>`
    mytablecontainer.innerHTML = tableconcat;
    //troutine de construction de la table
    updateProductTotal()
  }
  loadshop2()


function updateProductTotal() {
  //Get our product container and store it into a variable and select the first element in that array [0]
  let productItemContainer = document.getElementsByClassName("container_product")[0]
  //We want to use the same method to get all the different product row that are inside our product container
  productRows = productItemContainer.getElementsByClassName("prod_parent")
  //variable total set to 0 by default
  total = 0
  //loop throught all of those different products rows
  for (i = 0; i < productRows.length; i++) {
    // create a variable that would be our product row that is equal to whichever element we are in inside our array
    let productRow = productRows[i]
    //inside of our product row we want to get the price of that element and the quanityt of that element
    let priceElement =  productRow.getElementsByClassName("prod_price")[0]
    let quantityElement = productRow.getElementsByClassName("prod_quantity_input")[0]
    //remove the € and turn the strong into number
    // let price = parseInt(priceElement.innerHTML)
    let price = parseFloat(priceElement.innerHTML.replace("€", ""))
    let quantity = quantityElement.value
    //calculate the total
    total = total + (price * quantity)
  }
  //round the total, *100 to move our decimal place by Two and /100 to get back the decimal
  total = Math.round(total * 100) / 100
  //After our loop get the element with the total price ID and wanna set the new totat price
  document.getElementById("total_price").innerHTML = `Total : ${total} €`;
}
  // function loadbasket() {

  // }