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
  //For loop throught all of the different buttons inside of my shop
  for (i = 0; i < removeProductButtons.length; i++) {
    //variable that would be our button that is equal to whatever element in our array
    let button = removeProductButtons[i]
    //now we can use our button variable that correspond to our remove button in the shop
    //Add event listener to do something when button is clicked
    button.addEventListener("click", removeProductItem)
  }

  let dataNP = document.getElementsByClassName("formin");
  
  document.getElementById('prod_form').addEventListener('submit', function(e) {
    e.preventDefault()
    let inputFile = document.getElementById('files');
    let fd = new FormData();
    for (i=0; i<dataNP.length; i++) {
      fd.append(`${dataNP[i].id}`, dataNP[i].value)
    }
    fd.append("files",inputFile.files[0].name)
    fd.append("file",inputFile.files[0])
    // console.log(inputFile.files[0]);
    // console.log(fd);
    let req = new Request('/products', {
      method: "POST",
      body: fd
    });

    fetch(req)
    .then (
      response => response.json()
    )
    .then(
      response2 => console.log(response2) 
    )
    .catch(
      function(err){
        console.log(err.message)
      }
    ) 
    alert("Votre produit a été ajoutée avec succès")  
    for (i=0; i<dataNP.length; i++) {
      dataNP[i].value = '';
      loadshop2()
    }
    deleteImages()
  })

  //to make the total update every time we change the quantity and prevent negative number  
  let quantityInputs = document.getElementsByClassName("prod_quantity_input")
  for (i = 0; i <quantityInputs.length; i++){
    let input = quantityInputs[i]
    //add event listener change so that every time it changes run the defined function  
    input.addEventListener("change", quantityChanged)
  }
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

//TODO display an interface that allows the user to select what he wants to buy
function loadshop1(){
  let mydata
  let mytablecontainer = document.getElementById("mybody");
  let tableconcat = ``
}  

  function loadshop2(){
    fetch('/loadshop')
    .then(
      respData => respData.json()
    )
    .then(
      respData2 => loadShopFromServer(respData2)
    )
    .catch(
      function(err){
        console.log(err.message) 
      }
    )
    function loadShopFromServer(myproductsData){
    let mytablecontainer = document.getElementById("mybody");
    let tableconcat = `<table>
                        <thead>
                          <tr>
                            <td colspan="2">Image</td>
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
    for (i=0;i<myproductsData.length;i++){
      tableconcat += `<tr id="products" class="prod_parent">`
      tableconcat += `<td class='prod_file prod' colspan="2"><img id="shop_img"src="${myproductsData[i].files}"></td>
                      <td class="prod_name prod">${myproductsData[i].name}</td>
                      <td class="prod_ref prod">${myproductsData[i].ref}</td>
                      <td class="prod_desc prod">${myproductsData[i].desc}</td>
                      <td class="prod_inv prod">${myproductsData[i].inv}</td>
                      <td class="prod_price prod">${myproductsData[i].price} €</td>
                      <td class="prod_quantity prod">
                        <input class="prod_quantity_input" type="number" value="1">
                        <button class="btn btn_danger" type="button">REMOVE</button>
                    </td>`;
      tableconcat += "</tr>";
      //console.log(mydata[i])
    }
   
    tableconcat += `<tr><td id="total_price" colspan="8">Total : 25 €</td></tr>
                        <tr><td colspan="8"><button class="btn btn_primary btn_purchase" type="button">PURCHASE</button></td></tr>`;
    tableconcat += `    </tbody>
                      </table>`
    mytablecontainer.innerHTML = tableconcat;
    //troutine de construction de la table
    updateProductTotal()
    }
  }
  loadshop2()

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


function addImage(imgData){
  imagesObject.push(imgData);
  displayNumberOfImgs();
}

function displayImgData(imgData){
  let span = document.createElement('span');
  span.innerHTML = `<img class="thumb" id"prodImg" src="` + imgData + `"/>`;
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
  displayNumberOfImgs()
  document.getElementById('myprod_img').innerHTML = "";
  document.getElementById('files').value = "";
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('deleteImgs').addEventListener("click", deleteImages);

function updateProductTotal() {
  //Get our product container and store it into a variable and select the first element in that array [0]
  let productItemContainer = document.getElementsByClassName("container_product")[0]
  //We want to use the same method to get all the different product row that are inside our product container
  let productRows = productItemContainer.getElementsByClassName("prod_parent")
  //variable total set to 0 by default
  let totalPrice = 0
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
    //calculate the totalPrice
    totalPrice = totalPrice + (price * quantity)
  }
  //round the total, *100 to move our decimal place by Two and /100 to get back the decimal
  totalPrice = Math.round(totalPrice * 100) / 100
  //After our loop get the element with the total price ID and wanna set the new totat price
  document.getElementById("total_price").innerHTML = `Total : ${totalPrice} €`;
}