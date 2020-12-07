// PROBLEMS THAT STILL NEEDS SOLVING：
// - needs to fix --> Clicking on the item on cutting board  or pan twice will NOT make the item disappear 
// ------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------


var world
var camX = 0
var camY = 1.8
var camZ = 5
var score = 0
var remaining_time = 10
var score_holder

//*************HUD field
// var recipe_container = ["tomato slice","lettuce shred","bread","beef"]		//temporary recipe holder for a hamburger

var recipe_container, recipe_show_button, recipe_textholder
var recipe_button_container,recipe_close_button,recipe_close_textholder
var recipe_detail
var holdingitem_show_box
var holdingitem_show_box_img

//************* UI 
var selected_items,selected_items_name 					// user's current selection
var clearSelectionBtn, selectionUI	// clear selection and show current selection
// var clearSelection = false

var messageBoard
var msg = "Message Board"
// Plate UI: 
var assembleBtn, clearPlateBtn		// button that clears plate nad assemble ingredient into final dish
var clearBoardBtn					// button that clears cutting board items



//*************** Customer field
var customers_list = []
var astronaut, astronaut2, r2d2, puppy;
var customerx,customerycustomerz;
// moved following variables to order section of variable
	// var current_order
	// var customer_order_list = []				
	// var current_order_requirements = []			
var current_customer
var customer_hitbox;
var customer_clicked = false

//*************** Interactable Objects 1: objects that implement actions
var pot, pan, knife
var ketchup, hotSauce

// *************** Interactable Objects 2: ingredients (objects that can have actions implemented on)
var tomato, tomato_slice, cheese, cheese_slice, lettuce, lettuce_shreds, bread
var steak, cooked_steak, asparagus, cooked_asparagus


// ***************  FINAL DISH PRODUCT
var sandwich, steak_complete

//*************** Decorative / Stationary Objects 
var _floor, counter, wall1, wall2, wall3, wall4, wall5, wall6
var stove, fridgeBox, shelf
var plant1, basket1, basket2, basket3

//****************Cutting board
var board_stack = 0.9
var save_items, save_items_name		// previously selected item for the cutting board ONLY

//********************* pan
var pan_item, pan_item_name			// previously selected item for pan ONLY

//************* Action field
var holdingitem	= knife			// item that we are currently holding
var holding_item_name			// item name that we are currently holding
var container_holding_item
// var holding = false		   				// is there an item in our hands?
var selected_items,selected_items_name	// item at current selection
	


// variable for specific tools/item/ingredient
var knife_clicked = false
var bread_clicked = false


// order check
var current_order							// current order
var customer_order_list = []				// list of orders possible
var current_order_requirements = []			// list of ingrediants needed from current order
var food_in_plate = []						// ingrediants currently in plate
var food_in_plate_name = []					// name of ingre currently in plate

var iscorrect_food = false



// ****************************** SETUP() ******************************
// ---------------------------------------------------------------------
function setup() {
	noCanvas();
	world = new World('VRScene');



	// *************** RECIPE **************

	let recipex = 0;
	let recipey = 1.04;
	let recipez = 4.16;



	recipe_show_button = new Plane({
		x:0.9, y:recipey,z:recipez,
		red:255,green:239,blue:213,
		width:0.23,height:0.36,
		rotationX: -40, rotationY: -40,
		clickFunction: function(me){

			console.log("Show Receipe");
			recipe_textholder.show()
			recipe_close_button.show()
			recipe_container.setY(0)
		}
	})
	world.add(recipe_show_button)


	// Recipe hodler : will display on HUD
	recipe_container = new Container3D({
		// this contains: Recipe detail display on HUD and recipe close button 
		y:-1 
	});

	recipe_textholder = new Plane({
		x:0, y:0,z:-0.5,
		width: 0.5, height: 0.5,
		red:255,green:215,blue:0,
		clickFunction: function(me){
			// display current recipe detail
		}
	})
	recipe_textholder.tag.setAttribute('text','value: '+recipe_detail+';color: rgb(0,0,0); align: center;');
	
	// close btn on recipe display
	recipe_close_button = new Plane({
		x:0.19, y:0.2,z:-0.49,
		red:255,green:215,blue:0,
		width:0.05,height: 0.05,
		asset:'close_btn',
		// transparent:true,
		clickFunction: function(me){

			console.log("close Recipe");
			recipe_textholder.hide()
			recipe_close_button.hide()
			
			recipe_container.setY(-1)

		}
	})


	// hide upon refresh
	recipe_textholder.hide()
	recipe_close_button.hide()

	recipe_container.addChild(recipe_textholder);
	recipe_container.addChild(recipe_close_button);
	world.camera.holder.appendChild(recipe_container.tag);



	// recipe close button
	// recipe_button_container = new Container3D({
	// 	x:recipex,
	// 	y: -100
	// });
	// recipe_close_button = new Plane({
	// 	x:0, y:recipey,z:recipez,
	// 	red:255,green:0,blue:0,
	// 	width:1,height:0.5,depth:1,
	// 	clickFunction: function(me){

	// 		console.log("close Recipe");
	// 		recipe_container.setY(0);
	// 		recipe_container.show()
	// 		recipe_button_container.hide();
	// 		recipe_button_container.setY(-100);
	// 	}
	// })
	// recipe_close_textholder = new Plane({

	// 	x:0, y:recipey,z:recipez,
	// 	width: 0.5, height: 0.3,
	// 	red: 255, green: 255, blue: 255,
	// 	clickFunction: function(me){

	// 		console.log("close Recipe");
	// 		recipe_container.setY(0);
	// 		recipe_container.show()
	// 		recipe_button_container.hide();
	// 		recipe_button_container.setY(-100);
	// 	}

	// })
	// recipe_close_textholder.tag.setAttribute('text','value:' +recipe_detail+ ' ; color: rgb(0,0,0); align: center;');
	// recipe_button_container.addChild(recipe_close_button);
	// recipe_button_container.addChild(recipe_close_textholder);
	// world.camera.cursor.addChild(recipe_button_container);
	// recipe_button_container.hide();


	// ****************************** UI ******************************
		// Hold Item Show box
		holdingitem_show_box = new Plane({
			x:0,y:0.5,z:0,
			width:0.2,
			height:0.2
		})
		remaining_time = int(random(15,30))

		score_holder = new Plane({
			x:0,y:0.7,z:0,
			red:186,green:255,blue:201,
			width:0.5,
			height:0.2
		})
		score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center; width:1; height:1;');
		// **suggestion: add a # of orders completed successfully
		
		// clear selection button
		clearSelectionBtn = new Plane({
			x:0.45, y:0.515, z:-0.8,
			red:185,green:190,blue:195, opacity: 0.8,
			width:0.4, height:0.07,
			clickFunction: function(thePlane){
				console.log("Clear Selection!")
			
				if(knife_clicked){
					knife_clicked = false
					knifeMovement()
				}			
				else{
					selected_items = undefined
					selected_items_name = undefined
				}
				bread_clicked = false

			}
		})
		clearSelectionBtn.tag.setAttribute('text','value: Clear Selection ; color: rgb(0,0,0); align:center; height: 0.7; width:0.7;')


		// show user's current selection 
		selectionUI = new Plane ({
			x:0.45, y:0.6, z:-0.8,
			red:185,green:190,blue:195, opacity: 0.8,
			width:0.4, height:0.07
		})
		selectionUI.tag.setAttribute('text','value: You have not selected anything; color: rgb(0,0,0); align:center; height: 0.7; width: 0.7;')

		// Message Bar
		messageBoard = new Plane ({
			x: -0.5, y:0.56, z:-0.8,
			red:185,green:190,blue:195, opacity: 0.8,
			width:0.5, height:0.155
		})
		messageBoard.tag.setAttribute('text','value: '+ msg +'; color: rgb(0,0,0); align:center; height: 1; width:1;')

		// add Btns to the HUD
		// selectionUI.tag.setAttribute('cursor','rayOrigin: mouse')		
		// world.camera.cursor.addChild(holdingitem_show_box);
		world.camera.cursor.addChild(score_holder);
		world.camera.holder.appendChild(selectionUI.tag);
		world.camera.holder.appendChild(clearSelectionBtn.tag);
		world.camera.holder.appendChild(messageBoard.tag);


	
	//show the HUD
	world.camera.cursor.show();

	// Ajust Camera
	world.setUserPosition(camX,camY,camZ)

	// disable WASD control
	//world.camera.holder.removeAttribute('wasd-controls')




	//  **************** CUSTOMERS ****************
	customerx = 3
	customery = 1
	customerz = 5

	r2d2 = new Customer("r2d2_obj","r2d2_mtl",0,-0.5,0,190,1,"r2d2")
	puppy = new Customer("puppy_obj","puppy_mtl",0,0,0,40,3,"puppy")
	astronaut = new Customer("astronaut_obj","astronaut_mtl",0,-1,0,-90,0.5,"astronaut")
	astronaut2 = new Customer("astronaut2_obj","astronaut2_mtl",0,0,0,120,0.5,"astronaut2")

	customers_list.push(r2d2)
	customers_list.push(puppy)
	customers_list.push(astronaut)
	customers_list.push(astronaut2)

	current_customer = random(customers_list);
	current_customer.add_to_world()

	//**************** ORDER **************** 
	// customer_order_list = ["Steak", "Third Order","Sandwich"]
	customer_order_list = ["Steak","Sandwich"]

	set_random_customer_order()



	//  **************** SETTING ****************
		// FLOOR
		_floor = new Plane({
			x:0, y:0, z:0,
			width:20, height:30,
			red:120, green:120, blue:120,
			rotationX:-90, metalness:0.25,
			asset: "floor",
			repeatX: 50,
			repeatY: 50
		});
		// world.add(_floor);


	//  ******** COUNTER ********
		counter = new Ring({
			x:0, y:0.9, z:5,
			radiusInner: 0.35,
			radiusOuter: 2,
			red:200, green: 157, blue:105,
			rotationX: -90,
			asset:"wood"
		})
		world.add(counter);
		//Counter walls: 		x,		z,		rotateY
		wall1 = new Walls (0,		4.646,	0)
		wall2 = new Walls (-0.339,	4.803,	50)
		wall3 = new Walls (-0.359,	5.156,	125)
		wall4 = new Walls (0,		5.353,	180)
		wall5 = new Walls (0.326,	4.803,	-50)
		wall6 = new Walls (0.326,	5.156,	-125)


	// ******** SERVING AREA ********
		// plate = new Interactables('dish_obj','dish_mtl',0.85,0.94,5.13,1.5,1.5,1.5,0,0,0,0.85,0.94,5.13,0,0,0,0.5,'plate')
		plate = new Interactables('dish_obj','dish_mtl',	0.85, 0.94, 5.13,	1.5,1.5,1.5,	0,0,0,	0.85, 0.94, 5.13, 0.5,0.3,0.5,	'plate')

		// Plate UI -----------------
		clearPlateBtn = new Plane({
			x:1.45, y:0.978, z:4.841,
			width:0.4, height:0.19,
			rotationX:-128, rotationY:90, rotationZ: 180,
			red: 189, green: 183, blue:107,
			clickFunction: function(thePlane){
				clearPlate()
			}
		})
		clearPlateBtn.tag.setAttribute('text','value: Clear Plate; color: rgb(0,0,0); align: center; width:1.5; height:1.5;');
		world.add(clearPlateBtn)


		assembleBtn = new Plane({
			x:1.45, y:0.978, z:5.411,
			width:0.5, height:0.19,
			rotationX:-128, rotationY:90, rotationZ: 180,
			red: 189, green: 183, blue:107,
			clickFunction: function(thePlane){
				console.log("Assemble Order")
				assemblePlate()
			}
		})
		assembleBtn.tag.setAttribute('text','value: Assemble Order; color: rgb(0,0,0); align: center; width:1.5; height:1.5;');
		world.add(assembleBtn)


		mat = new Plane ({
			x:0.87, y:0.91, z:5.13,
			width:0.8, height:1,
			rotationX:-90, rotationZ:0,
			asset: "servingMat"
		})
		world.add(mat)

		blanket = new Plane ({
			x:-0.92, y:0.91, z:4.13,
			width:0.8, height:1,
			rotationX:-90, rotationY:-30,
			asset: "blanket"
		})
		world.add(blanket)


	//  ******** APPLIANCES ********
	// FRIDGE ---------------
		fridge = new Fridge()


	// ******** COOKING AREA ********
		stove = new Box({
			x:-0.93, y:0.91, z:5.28,
			width:1, height:0.76, depth:0.03,
			rotationX:-90, rotationY:100,
			asset: "stove",
			clickFunction: function(theBox) {
				console.log("stove was clicked!")
			}
		})
		world.add(stove)

		pot = new Objects('pot_obj','pot_mtl',-0.95,0.94,5.04,0.008,0.01,0.008,0,300,0,"pot")
		pan = new Interactables('pan_obj','pan_mtl',	-0.66,1,5.49,	1,1,1,	0,270,0,	-0.828,0.957,5.55, .61,0.2,.33,	"pan")


	//  ******** PREPARATION AREA ********
		// cutting board: interactable
		cuttingBoard = new Box ({

			x:0, y:0.91, z:4.23,
			width:1.21, height:0.9, depth:0.03,
			scaleX:0.5,scaleY:0.5,scaleY:0.5,
			rotationX: -90,
			asset:'boardPattern',
			// clickFunction: function(theBox) {

				// if user has selected sth
				// if(current_order == "Sandwich"){

				// 	if(holding){
				// 		board_stack += 0.05;
				// 		selected_items.setPosition(0,board_stack,4.2)

				// 		// put the selected item in the middle of the cutting board
				// 		cutting_board_item.push(selected_items);
				// 		food_in_plate.push(selected_items_name);
				// 		world.add(selected_items)
				// 		holding = false;
				// 		holdingitem_show_box.setAsset("")
				// 		let items_on_board = selected_items_name

				// 		console.log("cutting board was clicked!")
				// 	}
				// }
			// }

		})

		cuttingBoardBox = new Box({
			x:0, y:1.04, z:4.27,
			width:0.54, height:0.4, depth:0.21,
			scaleX:0.5,scaleY:0.5,scaleY:0.5,
			opacity: 0.6,
			// transparent:true,
			clickFunction: function(theBox){
				// items for cutting boards ONLY: LETTUCE, TOMATO, CHEESE
				// if use has selected an item
				bread_clicked = false
				msg = "Message Board"

				if(selected_items != undefined){

					// put the saved selected item in the box
					if(knife_clicked == false){
						// if the cutting board is not occupied 
						// - prevent user from adding more stuff when cutting board already has other itens
						if(save_items == undefined){
							// place sepcific item in center
							if(selected_items_name == 'tomato' || selected_items_name == 'cheese' || selected_items_name == 'lettuce' ){
								save_items = selected_items 
								save_items_name = selected_items_name
								
								// minor adjustment for lettuce
								if(selected_items_name == 'lettuce' ){
									save_items.setPosition(theBox.x,0.91,theBox.z)
								}else{
									save_items.setPosition(theBox.x,theBox.y,theBox.z)
								}
							}
							// msg = "Message Board"
						}else{
							// msg = "An item is \n already on \n the cutting board"
						}						
					}else{
						// iniate the animation of cutting
						

						// tomato - show tomato slice
						if(save_items_name == "tomato"){
                            // hide state before cutting
                            save_items.hide()
                            // substitute the product
                            save_items = new Objects('tomatoSlice_obj', 'tomatoSlice_mtl', -0.05,0.93,4.25, 0.15,0.15,0.15,	0,0,0, "tomato slice")
                            tomato_slice = save_items
							save_items_name = save_items.name
							save_items.show()

							console.log("tomato slice")
						}
						// cheese - show cheese slice
						else if(save_items_name == "cheese"){
							console.log(save_items)
							// hide state before cutting & substitute the product
							save_items.hide()
							cheese_slice  = new Box({
								x:theBox.x, y:1.05, z: theBox.z,
								width:0.17,	height:0.01, depth: 0.16,
								red:244, green:208, blue:63,
							})
							world.add(cheese_slice)
							save_items_name = "cheese slice"

							console.log("cheese slice")

						}
						// lettuce - show lettuce shreads
						else if(save_items_name == "lettuce"){
							save_items.hide()
							save_items = new Objects('lettuceShreds_obj', 'lettuceShreds_mtl', 0,1.05,4.28, 0.07,0.07,0.07,	0,0,0, "lettuce shreds")
							lettuce_shreds = save_items
							save_items_name = "lettuce shreds"
							save_items.show()

							console.log("lettuce shreds")
						}
						else{
							msg = "There is nothing \n there to cut"
						}
		
					}
					world.add(save_items)
                // user has not selected an item
                }else {
                    // check to see if there is item on the cutting board already
                    // save_items defines what was previously on the board
					if(save_items != undefined){
						// if so, selected item becomes the previously saved item
						selected_items = save_items
						selected_items_name = save_items_name
					}
				}
				console.log("You clicked on the cutting board!")
			}
		
		})
		world.add(cuttingBoard)
		world.add(cuttingBoardBox)

		// clear items on cutting board
		clearBoardBtn = new Plane({
			x:-0.478, y:1, z:4.037,
			width:0.33, height:0.1,
			rotationX:-128, rotationY:180, rotationZ: 180,
			red: 189, green: 183, blue:107,
			clickFunction: function(thePlane){
				console.log("Clear Items")
				clearCuttingBoard()
			}
		})
		clearBoardBtn.tag.setAttribute('text','value: Clear Cutting Board; color: rgb(0,0,0); align: center; width:0.7; height:0.7;');
		world.add(clearBoardBtn)

		// KNIFE
		knife = new Interactables('knife_obj','knife_mtl',	0.378, 0.84,4.35,	0.0015,0.0015,0.0015,	90,90,0,	0.402,0.851,4.2, 0.25,0.2,0.53, "knife")

	// ******** SPICE SHELF ********
		// spice shelf
		shelf = new Objects('shelf_obj','shelf_mtl',0,0.84,3.64,0.99,0.63,0.72,0,0,0,"shelf")
		ketchup = new Objects('ketchup_obj','ketchup_mtl',-0.51,1,4.17,0.0003,0.0003,0.0003,0,60,0,"ketchup")
		// trashCan =  new Objects('trashCan_obj','trashCan_mtl',0.28,0.112,4.979,0.002,0.002,0.002,0,0,0,"trashCan")
		hotSauce =  new Objects('hotSauce_obj','hotSauce_mtl',-0.07,1.18,3.75,0.3,0.3,0.3,0,180,0,"hotSauce")

		// ingrediants
		bread = new Interactables('bread_obj','bread_mtl',		-1.13,1,4.276,	1,1,1,	-80,30,0,	 -1.13,1,4.276,0.27,0.08,0.28,	"bread")		
		tomato= new Interactables('tomato_obj','tomato_mtl',	-0.5,1.45,3.64,	0.005,0.005,0.005,	-90,0,0, -0.5,1.45,3.64,0.3,0.3,0.3,	"tomato")
		lettuce = new Interactables('lettuce_obj', 'lettuce_mtl', 	-0.17,1.114,5.91,	0.03,0.03,0.03,	0,0,0,	 -0.18,1.184,5.90,0.14,0.14,0.15,	"lettuce")

		cheese = new Box({
			x:0.072, y:1.387, z:5.97,
			width:0.1,	height:0.08, depth: 0.13,
			red:244, green:208, blue:63,
			clickFunction: function(theBox) {

				// disable previous other varibales
				bread_clicked = false

				// update selected item - create a clone
				selected_items = new Box({
					x:0.072, y:1.387, z:5.97,
					width:0.1,	height:0.08, depth: 0.13,
					red:244, green:208, blue:63,
				})

				selected_items_name = "cheese"

				// Go to Cutting board now
			}
		})
		world.add(cheese)

		steak = new Interactables('steak_raw_obj','steak_raw_mtl',	0,1.187,5.95,	0.5,0.5,0.5,	-0,0,0,  0,1.197,5.97,	0.2,0.05,0.29,	"steak")
		asparagus = new Interactables('aspara_obj','aspara_mtl',	-0.2,1.387,5.97,	0.07,0.07,0.07,	-0,-60,0, -0.2,1.387,5.97,	0.2,0.05,0.29,	"asparagus")

		// var testOBJ = new OBJ({
		// 	asset:'steak_raw_obj',
		// 	mtl: 'steak_raw_mtl',
		// 	x:0, y:1, z:5,
		// 	scaleX: 0.5, scaleY:0.5, scaleZ:0.5,
		// 	// rotationX:0,
		// 	// rotationY:90
		// })
		// world.add(testOBJ)


		// ******** DECORATIONS ********
		// plant1 = new Objects('plant1_obj','plant1_mtl',			1.26,0.88,4.24,		0.1,0.1,0.1,	0,0,0)
		// var basket1 = new Objects('basket_obj','basket_mtl',	-0.86,1,4.48,		0.5,0.5,0.5,	0,0,0)
		// var basket2 = new Objects('basket_obj','basket_mtl',	-0.72,1,4.27,		0.5,0.5,0.5,	0,0,0)
		// var basket3 = new Objects('basket_obj','basket_mtl',	-0.58,1,4.05,		0.5,0.5,0.5,	0,0,0)
		//
		// *** below baskets seem to be too computationally expensive,
		// *** might consider remove/change them
		// var basket4 = new Objects('basket2_obj','basket2_mtl',	-1.18,0.89,4.26,	0.0001,0.0001,0.0001,	-90,90,0)
		// var basket5 = new Objects('basket2_obj','basket2_mtl',	-0.957,0.89,3.81,	0.0001,0.0001,0.0001,	-90,90,0)


}


// ****************************** DRAW() ******************************
// ---------------------------------------------------------------------
function draw() {

	// DISPLAY SCORE
	if(frameCount%60 == 0){
		score_holder.tag.setAttribute('text','value: Your Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center;');

		remaining_time -= 1
		if(remaining_time <= 0){


			current_customer.remove_from_world()
			let prev_customer = current_customer
			while(prev_customer == current_customer){
				current_customer = random(customers_list);
			}
			set_random_customer_order()

			current_customer.add_to_world()
			remaining_time = int(random(15,30))
			score -= 1
			score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center;');
		}
	}

	// move the holding item correspondingly following the mouse
	if(knife_clicked){
		holdingitem.setX(map(mouseX,0,windowWidth,-1,1))
		holdingitem.setY(map(mouseY,0,windowHeight,-0.5,0.5) * -1)
	}

	// update selection UI
	if(selected_items_name == undefined ){
		selectionUI.tag.setAttribute('text','value: Nothing Selected; color: rgb(0,0,0); align:center; height: 0.7; width:0.7;')
	}else{
		selectionUI.tag.setAttribute('text','value: '+ selected_items_name + ';  color: rgb(0,0,0); align:center; height: 0.7; width:0.7;')
	}


	// update message
	messageBoard.tag.setAttribute('text','value: '+ msg +'; color: rgb(0,0,0); align:center; height: 0.7; width: 0.7;')

	// display recipe details
	recipe_show_button.tag.setAttribute('text','value: '+recipe_detail+'; color: rgb(0,0,0); align: center;');
	recipe_textholder.tag.setAttribute('text','value: '+recipe_detail+';color: rgb(0,0,0); align: center;');

}



// ****************************** FUNCTIONS ******************************
// ---------------------------------------------------------------------
function set_random_customer_order(){
	// pick a random order from customer order_list
	current_order = random(customer_order_list);

	if(current_order == "Steak"){
		current_order_requirements = ["cooked steak","cooked asparagus"]
	}else if (current_order == "Sandwich"){
		current_order_requirements = ["tomato slice", "lettuce shreds", "bread", "cheese slice"]
	}else if (current_order == "Noodles"){
		current_order_requirements = []
	}

	// update recipe detail based on order
	if(current_order == "Steak"){
		recipe_detail =  "Current Order: Steak \n\n 1. Take out meat from fridge \n\n 2. Grill it on pan \n\n 3. Place grilled steak on plate \n\n 4. Take out asparagus from fridge \n\n 5. Place asparagus on the pan \n\n 6. Place asparagus in the Plate \n\n 7. Assemble the order \n\n 8. Serve the order"
	}
	// ** Suggestion: change or remove noodle to sth else, maybe a drink??
	else if(current_order == "Noodle"){
		recipe_detail = "Noodles Instruction Here"
	}
	else if(current_order == "Sandwich"){
		// recipe_detail = "The Customer wants a Sandwich \n\n Get the bread on the cutting board \n Get the tomato on the cuttin board \n Get the cheese on the cutting board \n Get the bread on the cutting board"
		recipe_detail = "Current Order: Sandwich \n\n 1. Cut tomato into tomato slice and put on plate \n\n 2. Take a slice of bread and put on plate \n\n3. Take cheese from fridge and cut into cheese slice \n\n 4. Put cheese slice on plate \n\n 5. Cut lettuce from fridge into lettuce shreds \n\n 6. Place lettuce shreds on plate \n\n 7. Assemble the order \n\n 8. Serve the order"
	}

}

// Recipe Function ----------
// checks whether the ingridents are correct
function check_recipe(){
	console.log("check recipe") 
	// if(current_order == "Steak"){
	// 	if(food_in_plate[0] == "steak")
	// 		if(food_in_plate[1] == "asparagus"){
	// 			//success
	// 			food_in_plate = []
	// 			for(let i = 0; i < pan_item.length; i++){
	// 				world.remove( pan_item[i])
	// 			}
	// 			pan_item = []
	// 			iscorrect_food = true
	// 			console.log("GOOD JOB");
	// 			score += remaining_time * 3

	// 			score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center;');

	// 		}
	// 		else{
	// 			//fail
	// 			food_in_plate = []
	// 			for(let i = 0; i < pan_item.length; i++){
	// 				world.remove( pan_item[i])
	// 			}
	// 			pan_item = []
	// 			iscorrect_food = false
	// 			score -= 1
	// 			score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center;');

	// 		}
	// 	else if(food_in_plate[0] == "asparagus"){
	// 		if(food_in_plate[1] == "steak"){
	// 			//success
	// 			food_in_plate = []
	// 			for(let i = 0; i < pan_item.length; i++){
	// 				world.remove( pan_item[i])
	// 			}
	// 			pan_item = []
	// 			iscorrect_food = true
	// 			console.log("GOOD JOB");
	// 			score += remaining_time * 3

	// 			score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center;');
	// 		}
	// 		else{
	// 			food_in_plate = []
	// 			for(let i = 0; i < pan_item.length; i++){
	// 				world.remove( pan_item[i])
	// 			}
	// 			pan_item = []
	// 			iscorrect_food = false
	// 			score -= 1
	// 			score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center;');

	// 		}

	// }

	// }

		// if no food in plate
		console.log(food_in_plate_name)
		if(food_in_plate_name.length == 0){			
			iscorrect_food = false
			return false
		}
		// if not enough ingrediants in plate
		else if(food_in_plate_name.length != current_order_requirements.length){
			iscorrect_food = false
			return false
		}
		// see if there are any WRONG ingredients
		else{
			// check each food in plate with recipe
			for(let i=0; i < food_in_plate_name.length; i++){

				if(!checkPlateToRecipe(food_in_plate_name[i])){
					iscorrect_food = false
					return false
				}
			}
			iscorrect_food = true
			return true
		}



}
// this function checks if given ingredient is already in plate
function checkPlateItems(ingredient){
	// there is nothing in plate
	if(food_in_plate_name.length == 0){
		return false
	}
	else{
		for(let j=0; j < food_in_plate_name.length; j++){
			if(ingredient == food_in_plate_name[j]){
				return true
			}
		}
		return false
	}
}

// checks given ingredient is correct according to current_order_requirements
function checkPlateToRecipe(ingredient){
	
	for(let i=0; i < current_order_requirements.length; i++){
		if(ingredient == current_order_requirements[i]){
			return true
		}
	}
	return false
	
}

function plateFunction(){

	// selected_items_name IN THIS FUNCTION IS ALWAYS GOING TO BE = PLATE

	// if user has selected an item
	if(selected_items != undefined){

		// if bread was triggered prior to clicking dish
		// this is necessary as bread does not go to cutting board or pan
		if(bread_clicked){
			// display bread -------------
			if(checkPlateItems('bread') == false){
				console.log("breads on plate")

				var new_bread = new Objects('bread_obj','bread_mtl',	0.765, 0.974, 4.964,	1,1,1,	-80,30,0, "bread")

				food_in_plate.push(new_bread)
				food_in_plate_name.push(new_bread.name)

				// bread_clicked = false

			}else{
				msg = "You already have \n bread in the plate"
				// console.log("You already have bread in the plate")
			}
		}

		// user did not select anything previously
		// clicking dish will check what is still lacking in terms of ingrediants
		if(save_items_name == undefined && bread_clicked == false && pan_item_name == undefined){
			
			// Display what user still needs
			// if(current_order == "Sandwich"){
				// if there is nothing in plate
				if(food_in_plate_name.length == 0){
					msg = "You still need: \n" + current_order_requirements
				}
				else{
					if(current_order_requirements.length == food_in_plate_name.length){
						msg = "The order is \n ready to be served!"
					}else{ 
						for(let i=0; i < food_in_plate_name.length; i++){
							for(let j=0; j < current_order_requirements.length; j++){
								// remove from current order what is required
								if(food_in_plate_name[i] == current_order_requirements[j]){
									current_order_requirements.splice(j,1)
								}
							}
						}
						// what user still lacks
						msg= "You still need: \n"+ current_order_requirements
					}

				}
		}


		// SHOW CUTTING BOARD INGREIDNTS TO PLATE: lettuce shreds, cheese slice, tomato slice
		else if(save_items_name != undefined && pan_item_name == undefined){

			// check if selected item is ALREADY in plate
			if(checkPlateItems(save_items_name)){
				msg = "You have already \n put this item \n in the plate."
			}
			else{
				//TOMATO SLICE ------
				if(save_items_name == "tomato slice"){

					save_items.utensil.hide()
					tomato_slice.utensil.setPosition(0.77, 0.93, 5.13)
					tomato_slice.utensil.show()
		
					// clear save_items
					save_items = undefined
					save_items_name = undefined
		
					// add ingredient to the plate array
					food_in_plate.push(tomato_slice)
					food_in_plate_name.push("tomato slice")
		
					world.add(tomato_slice)
				}

				//CHEESE SLICE ------
				if(save_items_name == "cheese slice"){
					// hide cheese slide on the cutting board
					cheese_slice.hide()
					cheese_slice.setPosition(0.7,1.052,5.3)
					cheese_slice.show()

					save_items = undefined
					save_items_name = undefined

					food_in_plate.push(cheese_slice)
					food_in_plate_name.push("cheese slice")

					// save_items = undefined
					// save_items_name = undefined
				}

				//LETTUCE SHREDS ------
				if(save_items_name == "lettuce shreds"){
		
					save_items.utensil.hide()
					lettuce_shreds.utensil.setPosition(1.02, 1, 5.16)
					lettuce_shreds.utensil.show()
		
					// clear save_items
					save_items = undefined
					save_items_name = undefined
		
					// add ingredient to the plate array
					food_in_plate.push(lettuce_shreds)
					food_in_plate_name.push("lettuce shreds")

					console.log("lettuce shreds")

					world.add(tomato_slice)
				}
				
			}
		}


		// SHOW PAN INGREIDNTS TO PLATE: steak, asparagus
		else if(pan_item_name != undefined && save_items_name == undefined){

			// check if selected item is ALREADY in plate
			if(checkPlateItems(pan_item_name)){
				msg = "You have already \n put this item \n in the plate."
			}else{
				// STEAK
				if(pan_item_name == "cooked steak"){

					// move cooked steak to plate
					cooked_steak.utensil.hide()
					cooked_steak.utensil.setPosition(0.76,0.971,5.194)
					cooked_steak.utensil.setScale(0.14,0.05,0.12)
					cooked_steak.utensil.show()

					// clear pan_items
					pan_item = undefined
					pan_item_name = undefined

					// add ingredient to the plate array
					food_in_plate.push(cooked_steak)
					food_in_plate_name.push("cooked steak")

					world.add(cooked_steak)

				}
				// ASPARAGUS
				else if(pan_item_name == "cooked asparagus"){
					
					// move cooked asparagus to plate
					cooked_asparagus.utensil.hide()
					cooked_asparagus.utensil.setPosition(0.87,0.968,4.967)
					cooked_asparagus.utensil.setScale(0.08,0.08,0.08)
					cooked_asparagus.utensil.show()

					// clear pan_items
					pan_item = undefined
					pan_item_name = undefined

					// add ingredient to the plate array
					food_in_plate.push(cooked_asparagus)
					food_in_plate_name.push("cooked asparagus")

					world.add(cooked_asparagus)

				}

			}
		}

		else if(pan_item_name != undefined && save_items_name != undefined){
			msg="Please clear your cutting board items first"
		}


	}
				

	

		
}

function panFunction(){

	// check if user has selected item appropriate to pan
	if(pan_item_name != undefined){
		// display generic message
		msg = "Message Board"
		console.log(pan_item)

		// put steak / asparagus on pan
		if(pan_item_name == "steak"){
			// display steak in pan
			if(selected_items_name == "pan"){

			}

			pan_item.setPosition(-0.869,0.969,5.549)
			world.add(pan_item)

			// sound effect for steak being cooked
			msg= "Now Cooking...\n Please do not remove steak"
			setTimeout(() => {
				// sound effect for steak finished cooked

				console.log("start cooking")
				pan_item.hide()
				pan_item = new Objects('steak_obj', 'steak_mtl', -0.88,0.96,5.554, 0.1,0.08,0.08,	0,0,0, "cooked steak")
				cooked_steak = pan_item
				pan_item_name = pan_item.name
				msg= "Your steak is ready!"
			}, 3000)
		}
		// selected cooked steak
		else if(pan_item_name == "cooked steak"){
			selected_items = cooked_steak
			selected_items_name = "cooked steak"
			// go to plate
		}

		if(pan_item_name == "asparagus"){
			pan_item.setPosition(-0.9,0.968,5.497)
			pan_item.setScale(0.06,0.06,0.06)
			world.add(pan_item)

			msg= "Now Cooking...\n Please do not remove asparagus"

			setTimeout(() => {
				// sound effect for asparagus finished cooked
				console.log("start cooking")
				pan_item.hide()
				pan_item = new Objects('aspara_obj', 'aspara_mtl', -0.9,0.968,5.497, 0.06,0.06,0.06,	0,-60,0, "cooked asparagus")
				cooked_asparagus = pan_item
				pan_item_name = pan_item.name
				msg= "Your asparagus is ready!"
			}, 3000)
		}
		else if(pan_item_name == "cooked asparagus"){
			selected_items = cooked_asparagus
			selected_items_name = "cooked asparagus"
		}


	}
	else{
		msg = "Use pan only for \n steak and asparagus"
	}

}

function serveOrder(){
	// clear plate
	plateIngredientRemoval()
	console.log("serveOrder function")

	// score calculation
	score += remaining_time * 3
	score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center;');
}

// Functions for UI ----------
function assemblePlate(){

	// check if current order is correct for assembly
	if(check_recipe()){
		// remove all in plate
		// plateIngredientRemoval()

		if(current_order == "Sandwich"){
			
			plateIngredientRemoval()

			// transform to final product and add to plate array
			sandwich = new Objects('sandwich_obj','sandwich_mtl',	0.81,1,5.12,	0.99,0.63,0.72,	0,90,-90,"sandwich")
			
			food_in_plate.push(sandwich)
			food_in_plate_name.push("sandwich")

			world.add(sandwich)
			msg = "Here is your \n\n" + food_in_plate_name

		}
		else if(current_order == "Steak"){
			
			// no model for finished steak tehrefore just arrangement
			cooked_steak.utensil.hide()
			cooked_asparagus.utensil.hide()

			cooked_steak.utensil.setPosition(0.865,0.961,5.131)
			cooked_steak.utensil.setScale(0.14,0.05,0.12)

			cooked_asparagus.utensil.setPosition(0.76,1.038,5.227)
			cooked_asparagus.utensil.setRotation(0, -20, 0)
			cooked_asparagus.utensil.setScale(0.07,0.05,0.08)

			cooked_steak.utensil.show()
			cooked_asparagus.utensil.show()

			msg = "Here is your \n\n steak"
			// food_in_plate.push(sandwich)
			// food_in_plate_name.push("sandwich")
		}

		iscorrect_food = true

		// display message
		// msg = "Here is your \n\n" + food_in_plate_name

		// PROCEED TO SERVE FUNCTION
	}
	else{
		// display message
		iscorrect_food = false
		msg = "Incorrect Ingredients \n or \n Missing Ingredients"
	}

}

function clearPlate(){

	if(food_in_plate_name.length != 0){
		// remove everything in the plate
		plateIngredientRemoval()

		msg = "Message Board"
	}
	else{
		msg = "You have nothing \n\n in your plate"
	}
}

function clearCuttingBoard(){
	// check if there is previously saved item on cutting board
	if(save_items_name != undefined){
		console.log("Cleared")
		console.log(save_items_name, save_items)

		if(save_items_name == "tomato" || save_items_name == "lettuce" ||save_items_name == "cheese"){
			world.remove(save_items)
		}else if(save_items_name == "cheese slice"){
			world.remove(cheese_slice)
		}
		else{
			world.remove(save_items.utensil)
		}

		// message board msg
		msg = "You removed \n" + save_items_name

		// clear cutting board variables
		save_items_name = undefined
		save_items = undefined
		
		// clear selection
		selected_items_name = "Nothing Selected"
		selected_items = undefined

	}else{
		msg = "There is nothing \n on cutting board"
	}
}

function plateIngredientRemoval(){
	for(let i=0; i < food_in_plate.length; i++){
		// cheese slice is not an OBJ therefore have to be treated differently
		if(food_in_plate[i] == cheese_slice){
			world.remove(food_in_plate[i])
		}
		else{
			world.remove(food_in_plate[i].utensil)
		}
	}

	// clear variables
	food_in_plate = []
	food_in_plate_name = []
}

function knifeMovement(){

	if(knife_clicked){
		// hide origianl knife
		knife.utensil.hide()
		holdingitem = new Objects('knife_obj','knife_mtl',	0.378, 0.84,4.35,	0.0015,0.0015,0.0015,	90,90,0, "knife").utensil

		//set the position and rotation to look natural
		holdingitem.setPosition(0,-0.2,-0.5)
		holdingitem.setRotation(0,0,0)
		holdingitem.rotateY(100)

		//set this as a cursor
		holdingitem.tag.setAttribute('cursor', 'rayOrigin: mouse');
		world.camera.holder.appendChild(holdingitem.tag);

	}
	else{
		
		// remove knife from the cursor camera
		world.camera.holder.removeChild(holdingitem.tag);
		knife.utensil.show()			// show original knife
		holdingitem.hide()				
		holdingitem = undefined

		// clear selection
		selected_items = undefined
		selected_items_name = undefined

		world.remove(holdingitem)		// remove cursor knife - prevent overloading the browser
	}
}


// ****************************** CLASSES ******************************
// ---------------------------------------------------------------------
class Fridge {

	constructor(){
		this.isclose = true
		this.hitboxsize = 0.35
		this.myContainer = new Container3D({
			x:0, y:0, z:0
		})
		this.fridgeBox = new OBJ({
			asset:'fridge_obj',
			mtl: 'fridge_mtl',
			x:0, y:1.27, z:5.9,
			scaleX: 1, scaleY:1, scaleZ:1,
			rotationX:0,
			rotationY:90
		})
		this.fridgeDoorClosed = new OBJ({

			asset:'fridgeDoor_obj',
			mtl: 'fridgeDoor_mtl',
			x:-0.15, y:1.34, z:5.74,
			scaleX: 1, scaleY:1, scaleZ:1,
			rotationX:0,
			rotationY:220
		})
		this.fridgeDoorOpen = new OBJ({

			asset:'fridgeDoor_obj',
			mtl: 'fridgeDoor_mtl',
			x:0.403, y:1.34, z:5.55,
			scaleX: 1, scaleY:1, scaleZ:1,
			rotationX:0,
			rotationY:80
		})
		this.hitbox_close = new Box({

			x:-0.05, y:1.34, z:5.74,
			scaleX: this.hitboxsize, scaleY:this.hitboxsize+0.2, scaleZ:this.hitboxsize,
			rotationX:0,opacity:0.5,
			clickFunction: function(me){
				fridge.Open_Door()
				msg = "Fridge Opened"

			}

		})
		this.hitbox_open = new Box({

			x:0.35, y:1.34, z:5.55,
			scaleX: this.hitboxsize, scaleY:this.hitboxsize+0.2, scaleZ:this.hitboxsize,
			rotationX:0,
			rotationY:220,opacity:0.5,
			clickFunction: function(me){
				fridge.Close_Door()
				msg = "Fridge Closed"

			}

		})


	  this.myContainer.addChild(this.fridgeBox)
  	this.myContainer.addChild(this.fridgeDoorClosed)
		this.myContainer.addChild(this.fridgeDoorOpen)
		this.myContainer.addChild(this.hitbox_close)
		this.myContainer.addChild(this.hitbox_open)
		this.fridgeDoorOpen.hide()
		this.hitbox_open.hide()
		this.hitbox_close.hide()
		this.hitbox_open.setY(-100)

		world.add(this.myContainer)
	}
	Open_Door(){
		this.fridgeDoorOpen.show()
		this.fridgeDoorClosed.hide()
		this.fridgeDoorClosed.setY(-100)

		this.hitbox_open.setY(1.34)
		this.hitbox_close.setY(-100)
		this.isclose = false;
	}
	Close_Door(){
		this.fridgeDoorOpen.hide()
		this.fridgeDoorClosed.show()
		this.fridgeDoorClosed.setY(1.34)

		this.hitbox_open.setY(-100)
		this.hitbox_close.setY(1.34)
		this.isclose = true
	}
}

// display statioanry objects
class Objects {
	constructor(_asset,_mtl,x,y,z,sX,sY,sZ,_rotationX,_rotationY,_rotationZ,_name){

		this.name = _name
		this.utensil = new OBJ({
			asset:_asset,
			mtl: _mtl,
			x:x, y:y, z:z,
			scaleX: sX, scaleY:sY, scaleZ: sZ,
			rotationX:_rotationX,
			rotationY:_rotationY,
			rotationZ:_rotationZ,
			clickFunction: function(me){
				console.log("You clicked "+ _name);
			}
		})
		world.add(this.utensil)
	}

}

// interactable objs
class Interactables {
	constructor(_asset,_mtl,	x,y,z,	sX,sY,sZ,	_rotationX,_rotationY,_rotationZ,	hitBoxX,hitBoxY,hitBoxZ, hitBozScaleX,hitBozScaleY,hitBozScaleZ,	_name){
		this.container = new Container3D({
			// blank
		})

		this.name = _name

		this.utensil = new OBJ({
			asset:_asset,
			mtl: _mtl,
			x:x, y:y, z:z,
			scaleX: sX, scaleY:sY, scaleZ: sZ,
			rotationX:_rotationX,
			rotationY:_rotationY,
			rotationZ:_rotationZ
		})
		this.container.add(this.utensil)

		this.hitbox = new Box({
			x: hitBoxX,
			y: hitBoxY,
			z: hitBoxZ,
			scaleX: hitBozScaleX,
			scaleY: hitBozScaleY,
			scaleZ: hitBozScaleZ,

			opacity: 0.6,


			clickFunction: function(theBox){

				// update current selection 
				selected_items_name = _name
				selected_items = new OBJ({asset:_asset,
					mtl: _mtl,
					x:x, y:y, z:z,
					scaleX: sX, scaleY:sY, scaleZ: sZ,
					rotationX:_rotationX,
					rotationY:_rotationY,
					rotationZ:_rotationZ
				})						

				// generic message for all items if nothing unordinary
				msg = "Message Board"

				// if selected item is knife
				if(selected_items_name == 'knife'){
					if(knife_clicked){
						knife_clicked = false
					}else{
						knife_clicked = true
					}
					knifeMovement()
				}

				else{
					knife_clicked = false

					if(selected_items_name == "bread"){
						bread_clicked = true
					}
					else if(selected_items_name == 'plate'){
						plateFunction()
					}
					else if(selected_items_name == "steak"){
						// make a saved variable for pan just like cutting board
						pan_item = selected_items
						pan_item_name = selected_items_name
					}
					else if(selected_items_name == "asparagus"){
						pan_item = selected_items
						pan_item_name = selected_items_name
					}
					else if(selected_items_name == "pan"){
						panFunction()
					} 
					else{
						bread_clicked = false
					}
				
					knifeMovement()

				}
			}
		
		})
		this.container.add(this.hitbox)

		world.add(this.container)


	}

}

class Customer{

	constructor(_asset, _mtl, x_align,y_align,z_align,_rotationY,_scale,_name){
		this.container = new Container3D({
			y: -10
		})
		this.name = _name
		this.customer = new OBJ({
			asset: _asset,
			mtl: _mtl,
			x: customerx + x_align,
			y: customery + y_align,
			z: customerz + z_align,
			rotationX: 0,
			rotationY: _rotationY,
			scaleX: _scale,
			scaleY: _scale,
			scaleZ: _scale
		});

		this.hitbox = new Plane({
			x: customerx + x_align -0.5,
			y: customery,
			z: customerz + z_align,
			rotationX: 0,
			rotationY: 90,
			scaleX: 1,
			scaleY: 1,
			scaleZ: 1,

			side:'double',
			clickFunction: function(me){
				// customer has been clicked 
				// customer_clicked = true
				//reveal order
				console.log(current_order);
			}
		})

		this.serve_button = new Plane({
			x: customerx + x_align -0.5,
			y: customery + 1,
			z: customerz + z_align + 1,
			red:0,green:120,blue:0,
			rotationX: 0,
			rotationY: 270,
			scaleX: 1,
			scaleY: 0.5,
			scaleZ: 1,
			asset:'serveimg',
			side:'double',
			clickFunction: function(me){				
				//check food
				if(iscorrect_food){
					console.log("next cus")
					current_customer.remove_from_world()
					let prev_customer = current_customer
					while(prev_customer == current_customer){
						current_customer = random(customers_list);
					}
					set_random_customer_order()
					current_customer.add_to_world()
					
					// serve order
					serveOrder()

					iscorrect_food = false

					msg = "You successfully \n served a " + current_order

				}
				else{
					msg = "The order is \n not ready"
				}
			}
		})

		this.kickout_button = new Plane({
			x: customerx + x_align -0.5,
			y: customery+1,
			z: customerz + z_align-1,
			red:120,green:0,blue:0,

			rotationX: 0,
			rotationY: 270,
			scaleX: 1,
			scaleY: 0.5,
			scaleZ: 1,
			asset: 'kickoutimg',
			side:'double',
			clickFunction: function(me){
				msg = "Oh no! \n You just kicked out \n a dear customer"

				// console.log("Kicked out the customer");
				remaining_time = int(random(15,30))

				score -= 1
				score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center;');
				food_in_plate = []
				for(let i = 0; i < cutting_board_item.length; i++){
					world.remove( cutting_board_item[i])
				}

				current_customer.remove_from_world()
				let prev_customer = current_customer
				while(prev_customer == current_customer){
					current_customer = random(customers_list);
				}
				set_random_customer_order()
				current_customer.add_to_world()

			}

		})

		this.container.addChild(this.customer)
		this.container.addChild(this.hitbox)
		this.container.addChild(this.serve_button)
		this.container.addChild(this.kickout_button)
		this.hitbox.hide()
		world.add(this.container)

	}
	//constructor ends

	add_to_world(){
		this.container.setY(0)
	}

	remove_from_world(){
		// set customer  clicked to false
		// customer_clicked = false
		this.container.setY(-10)
	}

}

// counter walls
class Walls {
	constructor(x,z,yrotate){
		this.wall = new Plane({
			x:x,y:0.430,z:z,
			width:0.480, height:0.93,
			red:168, green: 131, blue:86,
			rotationY:yrotate,
			asset:'wood'
		})
		world.add(this.wall)
	}
}
