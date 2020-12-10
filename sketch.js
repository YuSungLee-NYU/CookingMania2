// **** PROBLEMS THAT STILL NEEDS SOLVING ****：
// - needs to fix --> Clicking on the item on cutting board or pan twice will NOT make the item disappear
// --> timer needs to display lengthened time for ALL orders; currntly lengthened time only applies to the first order; 
// ---------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------


var world
var camX = 0
var camY = 1.8
var camZ = 5
var score = 0
var remaining_time = 10
var score_holder

//*************HUD field
var recipe_container, recipe_show_button, recipe_textholder
var recipe_button_container,recipe_close_button,recipe_close_textholder
var recipe_detail
var holdingitem_show_box
var holdingitem_show_box_img

//************* UI
var selected_items,selected_items_name 					// user's current selection
var clearSelectionBtn, selectionUI						// clear selection and show current selection

var messageBoard
var msg = "Please Check Recipe for Order"

// Plate UI:
var assembleBtn, clearPlateBtn		// button that clears plate nad assemble ingredient into final dish
var clearBoardBtn					// button that clears cutting board items



//*************** Customer field
var customers_list = []
var astronaut, astronaut2, r2d2, puppy;
var customerx,customerycustomerz;
var current_customer
var customer_hitbox;
var customer_clicked = false

//*************** Interactable Objects 1: objects that implement actions
var pot, pan, knife
var ketchup, hotSauce

// *************** Interactable Objects 2: ingredients (objects that can have actions implemented on)
var tomato, tomato_slice, cheese, cheese_slice, lettuce, lettuce_shreds, bread
var steak, cooked_steak, asparagus, cooked_asparagus

var noodle, cooked_noodle, egg, cooked_egg, noodle_container, water
var noodle_ready_to_cook = false, noodle_cooked = false
var start_water = false, water_filled = false
var water_y = 0.94

var start_bubble = false
var bubbles, bubble = []

var pasta1, pasta2, soup, egg1



// ***************  FINAL DISH PRODUCT
var sandwich, steak_complete, noodle_soup

//*************** Decorative / Stationary Objects
var _floor, counter, wall1, wall2, wall3, wall4, wall5, wall6
var stove, fridgeBox, shelf
var plant1, basket1, basket2, basket3,bowl

//**************** Cutting board
var board_item, board_item_name		// previously selected item for the cutting board ONLY

//********************* Pan
var pan_item, pan_item_name			// previously selected item for pan ONLY

//********************* Pot
var pot_item, pot_item_name			// previously selected item for pot ONLY
var pot_has = []					// list of items in pot (can only hold noodle + egg)

//************* Action field
var holdingitem								// item that we are currently holding
var selected_items, selected_items_name		// item at current selection


// variable for specific tools/item/ingredient
var knife_clicked = false
// var cutting = false
var bread_clicked = false


// order check
var current_order							// current order name
var customer_order_list = ["Noodle Soup","Sandwich", "Steak"]	// list of orders possible
var current_order_requirements = []			// list of ingrediants needed from current order
var food_in_plate = []						// ingrediants currently in plate
var food_in_plate_name = []					// name of ingre currently in plate

var iscorrect_food = false


//************* Sound Files
// var stove_click, boil, cut_tomato, food_to_plate, fridge_close, fridge_open, egg_cracking, eating
// var garbage, putting_cheese_on, sauce, switch_on

var boilSound, food_to_plate_sound,fridge_close,fridge_open,egg_cracking,eating,waterSound, frySound, assembleSound, placeFoodSound
var selectedSound, deselectSound, clearSound,cutSound, cutCheeseSound, errorSound, new_customer_sound, clearSound
var background_music,openRecipeSound,closeRecipeSound,finishSound, kickOutSound



// ****************************** PRELOAD() ******************************
//preload sounds
function preload(){
	background_music = loadSound("resources/sounds/background_music.wav")
	selectedSound = loadSound("resources/sounds/selected1.wav")
	deselectSound = loadSound("resources/sounds/deselect.wav")
	boilSound = loadSound("resources/sounds/boil.wav")
	cutSound = loadSound("resources/sounds/cutting_cheese.wav")
	cutCheeseSound = loadSound("resources/sounds/cut_tomato.wav")
	errorSound = loadSound("resources/sounds/error.wav")
	fridge_close = loadSound("resources/sounds/fridge_close.wav")
	fridge_open = loadSound("resources/sounds/fridge_open.wav")
	clearSound = loadSound("resources/sounds/clear.wav")
	assembleSound = loadSound("resources/sounds/assemble.wav")
	new_customer_sound = loadSound("resources/sounds/new_cus.wav")
	frySound = loadSound("resources/sounds/fry_oil.wav")
	waterSound = loadSound("resources/sounds/water.wav")
	egg_cracking = loadSound("resources/sounds/egg_cracking.wav")
	eating = loadSound("resources/sounds/eating.mp3")
	serveSound = loadSound("resources/sounds/serveSound.wav")
	placeFoodSound = loadSound("resources/sounds/food_to_plate.wav")
	openRecipeSound = loadSound("resources/sounds/open_recipe.wav")
	closeRecipeSound = loadSound("resources/sounds/close_recipe.wav")
	finishSound = loadSound("resources/sounds/finishSound.wav")
	kickOutSound  = loadSound("resources/sounds/kickOutSound.wav")
}




// ****************************** SETUP() ******************************
// ---------------------------------------------------------------------
function setup() {
	background_music.loop()


	noCanvas();
	world = new World('VRScene');



	// *************** RECIPE **************

	let recipey = 1.04;
	let recipez = 4.16;

	recipe_show_button = new Plane({
		x:0.9, y:recipey,z:recipez,
		red:255,green:239,blue:213,
		width:0.23,height:0.36,
		rotationX: -40, rotationY: -40,
		clickFunction: function(me){

			if (openRecipeSound.isPlaying()==false){
				openRecipeSound.play()
			}			
			
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
		transparent:true,
		clickFunction: function(me){

			if (closeRecipeSound.isPlaying()==false){
				closeRecipeSound.play()
			}

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


	// ****************************** UI ******************************
		remaining_time = int(random(60,120))

		score_holder = new Plane({
			x: 0, y:0.56, z:-0.8,
			red:186,green:255,blue:201,
			width:0.4,
			height:0.155
		})
		score_holder.tag.setAttribute('text','value: Score: ' +score+  '\n Remaining Time: '+remaining_time+' ; color: rgb(0,0,0); align: center; width:0.7; height:0.7;');
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
				if (deselectSound.isPlaying()==false){
					deselectSound.play()
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
		// messageBoard.tag.setAttribute('text','value: Please; color: rgb(0,0,0); align:center; height: 1; width:1;')

		// add Btns to the HUD
		world.camera.holder.appendChild(score_holder.tag);
		world.camera.holder.appendChild(selectionUI.tag);
		world.camera.holder.appendChild(clearSelectionBtn.tag);
		world.camera.holder.appendChild(messageBoard.tag);


	// Ajust Camera
	world.setUserPosition(camX,camY,camZ)

	// disable WASD control
	world.camera.holder.removeAttribute('wasd-controls')




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
		plate = new Interactables('dish_obj','dish_mtl',	0.85, 0.94, 5.13,	1.5,1.5,1.5,	0,0,0,	0.85, 0.94, 5.13, 0.5,0.3,0.5,	'plate')

		// Plate UI -----------------
		clearPlateBtn = new Plane({
			x:1.45, y:0.978, z:4.841,
			width:0.4, height:0.19,
			rotationX:-128, rotationY:90, rotationZ: 180,
			red: 189, green: 183, blue:107,
			clickFunction: function(thePlane){
				if (clearSound.isPlaying()==false){
					clearSound.play()
				}

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

		
		pot = new Interactables('pot_obj','pot_mtl',	-0.95,0.94,5.04,	0.008,0.01,0.008,	0,300,0,	-0.887,1.05, 4.975,	0.45,0.23,0.38,	"pot")
		pan = new Interactables('pan_obj','pan_mtl',	-0.66,1,5.49,		1,1,1,				0,270,0,	-0.828,0.957,5.55, .61,0.2,.33,		"pan")

		clearPotBtn = new Plane({
			x:-0.528, y:0.94, z:4.947,
			width:0.4, height:0.14,
			rotationX:-128, rotationY:-80, rotationZ: 180,
			red: 189, green: 183, blue:107,
			clickFunction: function(thePlane){
				clearPot()
			}
		})
		clearPotBtn.tag.setAttribute('text','value: Clear Pot; color: rgb(0,0,0); align: center; width:1; height:1;');
		world.add(clearPotBtn)

		clearPanBtn = new Plane({
			x:-0.438, y:0.94, z:5.467,
			width:0.4, height:0.14,
			rotationX:-128, rotationY:-80, rotationZ: 180,
			red: 189, green: 183, blue:107,
			clickFunction: function(thePlane){
				clearPan()
			}
		})
		clearPanBtn.tag.setAttribute('text','value: Clear Pan; color: rgb(0,0,0); align: center; width:1; height:1;');
		world.add(clearPanBtn)

	//  ******** PREPARATION AREA ********
		// cutting board: interactable
		cuttingBoard = new Box ({
			x:0, y:0.91, z:4.23,
			width:1.21, height:0.9, depth:0.03,
			scaleX:0.5,scaleY:0.5,scaleY:0.5,
			rotationX: -90,
			asset:'boardPattern'
		})

		cuttingBoardBox = new Box({
			x:0, y:1.04, z:4.27,
			width:0.98, height:0.4, depth:0.32,
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
						if(board_item == undefined){
							// place sepcific item in center
							if(selected_items_name == 'tomato' || selected_items_name == 'cheese' || selected_items_name == 'lettuce' ){
								board_item = selected_items
								board_item_name = selected_items_name

								// minor adjustment for lettuce
								if(selected_items_name == 'lettuce' ){
									board_item.setPosition(theBox.x,0.91,theBox.z)
								}else{
									board_item.setPosition(theBox.x,theBox.y,theBox.z)
								}

								if (placeFoodSound.isPlaying()==false){
									placeFoodSound.play()
								}
							}
							// msg = "Message Board"
						}
					}else{
						// iniate the animation of cutting
						
						// tomato - show tomato slice
						if(board_item_name == "tomato"){
							if (cutSound.isPlaying()==false){
								cutSound.play()
							}

                            // hide state before cutting
                            board_item.hide()
                            // substitute the product
                            board_item = new Objects('tomatoSlice_obj', 'tomatoSlice_mtl', -0.05,0.93,4.25, 0.15,0.15,0.15,	0,0,0, "tomato slice")
                            tomato_slice = board_item
							board_item_name = board_item.name
							board_item.show()

						
						}
						// cheese - show cheese slice
						else if(board_item_name == "cheese"){
							// hide state before cutting & substitute the product
							board_item.hide()
							cheese_slice  = new Box({
								x:theBox.x, y:1.05, z: theBox.z,
								width:0.17,	height:0.01, depth: 0.16,
								red:244, green:208, blue:63,
							})
							world.add(cheese_slice)
							board_item_name = "cheese slice"

							if (cutCheeseSound.isPlaying()==false){
								cutCheeseSound.play()
							}
						}
						// lettuce - show lettuce shreads
						else if(board_item_name == "lettuce"){
							if (cutCheeseSound.isPlaying()==false){
								cutCheeseSound.play()
							}	

							board_item.hide()
							board_item = new Objects('lettuceShreds_obj', 'lettuceShreds_mtl', 0,1.05,4.28, 0.07,0.07,0.07,	0,0,0, "lettuce shreds")
							lettuce_shreds = board_item
							board_item_name = "lettuce shreds"
							board_item.show()

											
						}
						else{
							msg = "There is nothing \n there to cut"
						}

					}
					world.add(board_item)
                // user has not selected an item
                }else {
                    // check to see if there is item on the cutting board already
                    // board_item defines what was previously on the board
					if(board_item != undefined){
						// if so, selected item becomes the previously saved item
						if (selectedSound.isPlaying()==false){
							selectedSound.play()
						}

						selected_items = board_item
						selected_items_name = board_item_name
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
				if (clearSound.isPlaying()==false){
					clearSound.play()
				}
			}
		})
		clearBoardBtn.tag.setAttribute('text','value: Clear Cutting Board; color: rgb(0,0,0); align: center; width:0.7; height:0.7;');
		world.add(clearBoardBtn)

		// KNIFE
		knife = new Interactables('knife_obj','knife_mtl',	0.378, 0.84,4.35,	0.0015,0.0015,0.0015,	90,90,0,	0.402,0.851,4.2, 0.25,0.2,0.53, "knife")


	// ******** SPICE SHELF ********
		// shelf
		shelf = new Objects('shelf_obj','shelf_mtl',0,0.84,3.64,0.99,0.63,0.72,0,0,0,"shelf")
		// ketchup = new Objects('ketchup_obj','ketchup_mtl',-0.51,1,4.17,0.0003,0.0003,0.0003,0,60,0,"ketchup")
		// trashCan =  new Objects('trashCan_obj','trashCan_mtl',0.28,0.112,4.979,0.002,0.002,0.002,0,0,0,"trashCan")
		// hotSauce =  new Objects('hotSauce_obj','hotSauce_mtl',-0.07,1.18,3.75,0.3,0.3,0.3,0,180,0,"hotSauce")

		// ingredients
		// sandwich
		bread = new Interactables('bread_obj','bread_mtl',		-1.13,1,4.276,	1,1,1,	-80,30,0,	 -1.13,1,4.276,0.27,0.08,0.28,	"bread")
		tomato= new Interactables('tomato_obj','tomato_mtl',	-0.5,1.45,3.64,	0.005,0.005,0.005,	-90,0,0, -0.5,1.45,3.64,0.3,0.3,0.3,	"tomato")
		lettuce = new Interactables('lettuce_obj', 'lettuce_mtl', 	-0.18,1.114,5.91,	0.03,0.03,0.03,	0,0,0,	 -0.17,1.224,5.90,0.14,0.1,0.15,	"lettuce")
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

				if (selectedSound.isPlaying()==false){
					selectedSound.play()
				}
				
				selected_items_name = "cheese"

				// Go to Cutting board now
			}
		})
		world.add(cheese)

		// steak
		steak = new Interactables('steak_raw_obj','steak_raw_mtl',	0,1.187,5.95,	0.5,0.5,0.5,	-0,0,0,  0,1.197,5.97,	0.2,0.05,0.29,	"steak")
		asparagus = new Interactables('aspara_obj','aspara_mtl',	-0.2,1.387,5.97,	0.07,0.07,0.07,	-0,-60,0, -0.2,1.387,5.97,	0.2,0.05,0.29,	"asparagus")

		// noodle 
		egg = new Interactables('egg_obj', 'egg_mtl', 	0.037,0.991,5.87, 	0.001,0.001,0.001, 	-80,30,0,		0.037,1.03,5.87,	0.17,0.09,0.2, 	"egg")
		bowl = new Objects('basket_obj','basket_mtl',	-0.172,1.042,5.899,		0.380,0.380,0.380,	0,0,0, "bowl")
		
		noodle = new Container3D({
			x:-0.21, y:1.03, z:5.9,
			rotationX:90, rotationZ:20,
		})
		world.add(noodle)
		
		for (var i =0;i<4;i++){
			var pasta = new TorusKnot({
				x:0.03*i, y:0.001*i, z:0,
				width:0.1,	height:0.08, depth: 0.13,
				red:244, green:188, blue:25,
				scaleX:0.02, scaleY:0.02, scaleZ: 0.02,
				rotationX:0.1+0.05*i, rotationY:0.1 +0.05*i, rotationZ:0.1+0.05*i,
				clickFunction: function(theBox) {
		
					// disable previous other varibales to prevent conflict
					bread_clicked = false

					// update selected item 
					selected_items_name = "noodle"
					// and directly update pot_item_name
					pot_item_name = "noodle"

					if (selectedSound.isPlaying()==false){
						selectedSound.play()
					}
				}
			})
			noodle.add(pasta)
		}

		// bubbles= new Bubbles(-0.95,0.94,5.04)
		// bubble.push(bubbles,bubbles,bubbles,bubbles,bubbles)
	



		// var testOBJ = new OBJ({
		// 	asset:'noodleSoup_obj',
		// 	mtl: 'noodleSoup_mtl',
		// 	x:0, y:1, z:5,
		// 	scaleX: 0.5, scaleY:0.5, scaleZ:0.5,
		// 	// rotationX:0,
		// 	// rotationY:90
		// })
		// world.add(testOBJ)


		// ******** DECORATIONS ********
		// plant1 = new Objects('plant1_obj','plant1_mtl',			1.26,0.88,4.24,		0.1,0.1,0.1,	0,0,0)
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

	// Knife
	if(knife_clicked){
		holdingitem.setX(map(mouseX,0,windowWidth,-1,1) + 0.11)
		holdingitem.setY(map(mouseY,0,windowHeight,-0.5,0.5) * -1)
	}


	// Bubble Effects:
	// if (start_bubble){
		// for (var i = 0; i < bubble.length; i++) {
		// 	bubble[i].move()
		// }
		// start_bubble = false
	// }

	// check if noodle is ready
	if(noodle_ready_to_cook){
		cookNoodle()
		noodle_ready_to_cook = false
	}

	// is water filled?
	if(start_water){

		if(water.y != 1){
			water_y += 0.001
		}else{
			water.y = 1
			start_water = false
			water_filled = true
		}
		water.setY(water_y)

		if (waterSound.isPlaying()==false){
			waterSound.play()
		}
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
	clearPlate()
	msg = "Message Board"
	current_order = random(customer_order_list);

	// order ingredients
	if(current_order == "Steak"){
		current_order_requirements = ["cooked steak","cooked asparagus"]
	}else if (current_order == "Sandwich"){
		current_order_requirements = ["tomato slice", "lettuce shreds", "bread", "cheese slice"]
	}else if (current_order == "Noodle Soup"){
		current_order_requirements = ["noodle soup"]
	}

	// update recipe detail based on order
	if(current_order == "Steak"){
		recipe_detail =  "Current Order: Steak \n\n 1. Take out meat from fridge \n\n 2. Grill it on pan \n\n 3. Place grilled steak on plate \n\n 4. Take out asparagus from fridge \n\n 5. Place asparagus on the pan \n\n 6. Place asparagus in the Plate \n\n 7. Assemble the order \n\n 8. Serve the order"
	}
	// ** Suggestion: change or remove noodle to sth else, maybe a drink??
	else if(current_order == "Noodle Soup"){
		recipe_detail = "Current Order: Noodle Soup \n\n 1. Take out noodle and egg from fridge \n\n 2. put them in cooking pot \n\n 3. It will automatically start adding the water \n\n 4. Please do not click the pot while cooking \n\n 5. When finished, select the cooked noodle \n\n 6. Click on plate \n\n 7. Assemble the order \n\n 8. Serve the order "
	}
	else if(current_order == "Sandwich"){
		// recipe_detail = "The Customer wants a Sandwich \n\n Get the bread on the cutting board \n Get the tomato on the cuttin board \n Get the cheese on the cutting board \n Get the bread on the cutting board"
		recipe_detail = "Current Order: Sandwich \n\n 1. Cut tomato into tomato slice and put on plate \n\n 2. Take a slice of bread and put on plate \n\n3. Take cheese from fridge and cut into cheese slice \n\n 4. Put cheese slice on plate \n\n 5. Cut lettuce from fridge into lettuce shreds \n\n 6. Place lettuce shreds on plate \n\n 7. Assemble the order \n\n 8. Serve the order"
	}
	recipe_show_button.tag.setAttribute('text','value: '+recipe_detail+'; color: rgb(0,0,0); align: center;');
	recipe_textholder.tag.setAttribute('text','value: '+recipe_detail+';color: rgb(0,0,0); align: center;');

}

// checks whether the ingridents are correct
function check_recipe(){
	console.log(food_in_plate_name)
	console.log(current_order_requirements)


	// if no food in plate
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
		// everythings fine
		iscorrect_food = true
		return true
	}
}

// this function checks if given ingredient is already in plate
function checkPlateItems(ingredient){
	console.log(food_in_plate_name)
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

function checkPotItems(ingredient){
	if(pot_has.length == 0){
		return false
	}
	else{
		for(let i=0; i < pot_has.length; i++){
			if(ingredient == pot_has[i]){
				return true
			}
		}
		return false
	}
}

function plateFunction(){
	// selected_items_name in this function is ALWAYS = PLATE
	console.log(food_in_plate_name)
	console.log(food_in_plate)

	// if user has selected an item/ aka the plate
	if(selected_items != undefined){

		// if bread was triggered prior to clicking plate
		// this is necessary as bread does not go to cutting board/pan/pot
		if(bread_clicked){
			// display bread on plate -------------
			if(checkPlateItems('bread') == false){
				console.log("breads on plate")

				var new_bread = new Objects('bread_obj','bread_mtl',	0.765, 0.974, 4.964,	1,1,1,	-80,30,0, "bread")

				food_in_plate.push(new_bread)
				food_in_plate_name.push(new_bread.name)

				if (placeFoodSound.isPlaying()==false){
					placeFoodSound.play()
				}

			}else{
				if (errorSound.isPlaying()==false){
					errorSound.play()
				}
				msg = "You already have \n bread in the plate"
			}
		}

		// user did not select anything previously
		// clicking dish will check what is still lacking in terms of ingrediants
		if(board_item_name == undefined && bread_clicked == false && pan_item_name == undefined && pot_item_name == undefined){

			if (errorSound.isPlaying()==false){
				errorSound.play()
			}
			// Display what user still needs
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
							// remove from current order the ingredients the user already prepared
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
		else if(board_item_name != undefined && pan_item_name == undefined){

			// check if selected item is ALREADY in plate
			if(checkPlateItems(board_item_name)){
				if (errorSound.isPlaying()==false){
					errorSound.play()
				}

				msg = "You already have this \n\n in the plate."
			}
			else{
				//TOMATO SLICE ------
				if(board_item_name == "tomato slice"){

					board_item.utensil.hide()
					tomato_slice.utensil.setPosition(0.77, 0.93, 5.13)
					tomato_slice.utensil.show()

					// clear board_item
					board_item = undefined
					board_item_name = undefined

					if (placeFoodSound.isPlaying()==false){
						placeFoodSound.play()
					}

					// add ingredient to the plate array
					food_in_plate.push(tomato_slice)
					food_in_plate_name.push("tomato slice")

					world.add(tomato_slice)
				}

				//CHEESE SLICE ------
				if(board_item_name == "cheese slice"){
					// hide cheese slide on the cutting board
					cheese_slice.hide()
					cheese_slice.setPosition(0.7,1.052,5.3)
					cheese_slice.show()

					board_item = undefined
					board_item_name = undefined

					if (placeFoodSound.isPlaying()==false){
						placeFoodSound.play()
					}

					food_in_plate.push(cheese_slice)
					food_in_plate_name.push("cheese slice")
				}

				//LETTUCE SHREDS ------
				if(board_item_name == "lettuce shreds"){

					board_item.utensil.hide()
					lettuce_shreds.utensil.setPosition(1.02, 1, 5.16)
					lettuce_shreds.utensil.show()

					// clear board_item
					board_item = undefined
					board_item_name = undefined

					if (placeFoodSound.isPlaying()==false){
						placeFoodSound.play()
					}

					// add ingredient to the plate array
					food_in_plate.push(lettuce_shreds)
					food_in_plate_name.push("lettuce shreds")

					world.add(lettuce_shreds)
				}

			}
		}


		// SHOW PAN INGREIDNTS TO PLATE: cooked_steak, cooked_asparagus
		else if(pan_item_name != undefined && board_item_name == undefined){

			// check if selected item is ALREADY in plate
			if(checkPlateItems(pan_item_name)){
				if (errorSound.isPlaying()==false){
					errorSound.play()
				}
				msg = "You already have this \n\n in the plate."
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

					if (placeFoodSound.isPlaying()==false){
						placeFoodSound.play()
					}

					// add ingredient to the plate array
					food_in_plate.push(cooked_steak)
					food_in_plate_name.push("cooked steak")

					world.add(cooked_steak)
					world.remove(pan_item)
					
					// clearPan()
					msg = "Message Board"


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

					if (placeFoodSound.isPlaying()==false){
						placeFoodSound.play()
					}
					// add ingredient to the plate array
					food_in_plate.push(cooked_asparagus)
					food_in_plate_name.push("cooked asparagus")

					world.add(cooked_asparagus)
					world.remove(pan_item)


					// clearPan()
					msg = "Message Board"

				}

			}
		}


		// SHOW POT INGREIDNTS TO PLATE: "noodle soup"
		else if(pot_item_name == "cooked noodle" && pan_item_name == undefined && board_item_name == undefined){
				// check if selected item is ALREADY in plate
				if(checkPlateItems(pot_item_name)){
					if (errorSound.isPlaying()==false){
						errorSound.play()
					}

					msg = "You already have this \n\n in the plate."
				}else{

					// noodle_soup
					noodle_soup = new Objects('noodleSoup_obj','noodleSoup_mtl',	0.84,0.96,5.12,	0.03,0.03,0.03,	0,0,0,"noodle soup")
					
					if (placeFoodSound.isPlaying()==false){
						placeFoodSound.play()
					}

					// add to plate
					food_in_plate.push(noodle_soup)
					food_in_plate_name.push("noodle soup")

					// clear pot
					clearPot()

					world.add(noodle_soup)

				}
		}


		else if(pan_item_name != undefined && board_item_name != undefined){
			if (errorSound.isPlaying()==false){
				errorSound.play()
			}
			msg="Please only do \n\n one dish at a time"
		}


	}





}

function potFunction(){

	// only activate when noodle is not cooked
	if(!noodle_cooked && !noodle_ready_to_cook){

	// check if user has selected item appropriate to pan
		if (pot_item_name == "noodle" || pot_item_name == "egg"){

			// check if there is anything in pot 
			if(!checkPotItems(pot_item_name)){

				// container for noodle
				noodle_container = new Container3D({
					// blank
				})

				// you have to cook both egg and noodles TOGETHER
				// for egg
				if(pot_item_name == "egg"){

					pot_has.push("egg")

					// add egg
					cooked_egg = pot_item
					cooked_egg.setPosition(-0.96,1,4.975)
					noodle_container.addChild(cooked_egg)

					if (egg_cracking.isPlaying()==false){
						egg_cracking.play()
					}	
				}

				// for noodle
				if(pot_item_name == "noodle"){

					pot_has.push("noodle")

					noodle_copy = new Container3D({

					}) 

					// create a copy of torus noodle and add to container
					for (var i =0;i<4;i++){
						var pasta_copy = new TorusKnot({
							x:-0.98+0.03*i, y:1+0.001*i, z:5.04,
							width:0.1,	height:0.08, depth: 0.13,
							red:244, green:188, blue:25,
							scaleX:0.02, scaleY:0.02, scaleZ: 0.02,
							rotationX:90+0.1+0.05*i, rotationY:0.1 +0.05*i, rotationZ:20+0.1+0.05*i,
						})
						noodle_copy.addChild(pasta_copy)
					}

					noodle_container.addChild(noodle_copy)
					if (placeFoodSound.isPlaying()==false){
						placeFoodSound.play()
					}	
				}

				world.add(noodle_container)

				// is noodle ready to be cooked??
				if(pot_has.length == 2){
					// set cook ready = true; jump to cookNoodle()
					noodle_ready_to_cook = true
					pot_item_name = "Cooking Noodle"
					selected_items_name = "Cooking Noodle"
				}

			}
			else{
				// error sound
				if (errorSound.isPlaying()==false){
					errorSound.play()
				}

				msg="You already have \n\n "+ pot_item_name + " in the pot"
			}

		}
		else if(board_item_name != undefined || pan_item_name != undefined){
			// error sound
			if (errorSound.isPlaying()==false){
				errorSound.play()
			}

			msg="Cooking pot is only \n\n for noodles and eggs"
		}
		
		if(pot_has.length == 2){
			// error sound
			if (errorSound.isPlaying()==false){
				errorSound.play()
			}

			msg = "The noodle has not been cooked"
		}
	}
	else if(noodle_ready_to_cook){
		if (errorSound.isPlaying()==false){
			errorSound.play()
		}

		msg = "Please wait ... \n\n Now Cooking"
	}
	// if noodle has been cooked
	else if(noodle_cooked){
		if (selectedSound.isPlaying()==false){
			selectedSound.play()
		}
		selected_items_name = "cooked noodle"
		pot_item_name = "cooked noodle"

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
	
			pan_item.setPosition(-0.869,0.969,5.549)
			world.add(pan_item)

			// sound effect for steak being cooked
			msg= "Now Cooking...\n Please do not remove/click steak"
			
			if (frySound.isPlaying()==false){
				frySound.play()
			}	

			if(pan_item_name != undefined){
				setTimeout(() => {
					// sound effect for steak finished cooked
					if(pan_item_name != undefined){
				
						pan_item.hide()
						pan_item = new Objects('steak_obj', 'steak_mtl', -0.88,0.96,5.554, 0.1,0.08,0.08,	0,0,0, "cooked steak")
						cooked_steak = pan_item
						pan_item_name = pan_item.name

						frySound.pause()
						if (finishSound.isPlaying()==false){
							finishSound.play()
						}	
						kick
						msg= "Your steak is ready!"
					}
				}, 2000)
			}
		}
		// selected cooked steak
		else if(pan_item_name == "cooked steak"){

			if (selectedSound.isPlaying()==false){
				selectedSound.play()
			}

			selected_items = cooked_steak
			selected_items_name = "cooked steak"
			// go to plate
		}

		if(pan_item_name == "asparagus"){
			pan_item.setPosition(-0.9,0.968,5.497)
			pan_item.setScale(0.06,0.06,0.06)
			world.add(pan_item)

			msg= "Now Cooking...\n Please do not remove/click asparagus"
			if (frySound.isPlaying()==false){
				frySound.play()
			}	

			setTimeout(() => {

				// sound effect for asparagus finished cooked

				pan_item.hide()
				pan_item = new Objects('aspara_obj', 'aspara_mtl', -0.9,0.968,5.497, 0.06,0.06,0.06,	0,-60,0, "cooked asparagus")
				cooked_asparagus = pan_item
				pan_item_name = pan_item.name

				frySound.pause()
				if (finishSound.isPlaying()==false){
					finishSound.play()
				}	

				msg= "Your asparagus is ready!"
			}, 2000)
		}
		else if(pan_item_name == "cooked asparagus"){

			if (selectedSound.isPlaying()==false){
				selectedSound.play()
			}

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

	if (serveSound.isPlaying()==false){
		serveSound.play()
	}

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

		if (assembleSound.isPlaying()==false){
			assembleSound.play()
		}

		if(current_order == "Sandwich"){


			// transform to final product and add to plate array
			sandwich = new Objects('sandwich_obj','sandwich_mtl',	0.81,1,5.12,	0.99,0.63,0.72,	0,90,-90,"sandwich")
			
			plateIngredientRemoval()

			food_in_plate.push(sandwich)
			food_in_plate_name.push("sandwich")

			world.add(sandwich)
			msg = "Here is your \n\n" + food_in_plate_name

		}
		else if(current_order == "Steak"){

			// no model for finished steak therefore just arrangement
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
		else if(current_order == "Noodle Soup"){
			msg = "Your noodle is ready! "
		}


		iscorrect_food = true


		// PROCEED TO SERVE FUNCTION
	}
	else{

		if (errorSound.isPlaying()==false){
			errorSound.play()
		}

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
	if(board_item_name != undefined){
		console.log("Cleared")
		console.log(board_item_name, board_item)

		if(board_item_name == "tomato" || board_item_name == "lettuce" ||board_item_name == "cheese"){
			world.remove(board_item)
		}else if(board_item_name == "cheese slice"){
			world.remove(cheese_slice)
		}
		else{
			world.remove(board_item.utensil)
		}

		// message board msg
		msg = "You removed \n" + board_item_name

		if (clearSound.isPlaying()==false){
			clearSound.play()
		}

		// clear cutting board variables
		board_item_name = undefined
		board_item = undefined

		// clear selection
		selected_items_name = "Nothing Selected"
		selected_items = undefined

	}else{
		if (errorSound.isPlaying()==false){
			errorSound.play()
		}

		msg = "There is nothing \n on cutting board"
	}
}

function clearPot(){

	// if there are things in the pot
	if(pot_has.length != 0){
		// clear variables
		pot_item_name = undefined
		pot_item = undefined
		noodle_cooked = false
		noodle_ready_to_cook = false

		for(let i=0; i < pot_has.length; i++){
			if(pot_has[i] == "egg"){
				noodle_container.removeChild(cooked_egg)
			}
			else if(pot_has[i] == "noodle"){
				let torusKnots = noodle_copy.getChildren()
				for(let i=0; i < torusKnots.length; i++){
					noodle_copy.removeChild(torusKnots[i])
				}
				// world.remove(noodle_copy)

			}
			else if(pot_has[i] == "water"){
				noodle_container.removeChild(water)
			}
		}
		
		if (clearSound.isPlaying()==false){
			clearSound.play()
		}

		pot_has = []

		world.remove(cooked_egg)
		world.remove(noodle_container)
		world.remove(noodle_copy)


	}else{
		// clear variables
		pot_item_name = undefined
		pot_item = undefined
		noodle_cooked = false
		noodle_ready_to_cook = false
		pot_has = []

		if (errorSound.isPlaying()==false){
			errorSound.play()
		}

		msg ="There is nothing in the \n\n cooking pot"

	}
}

function clearPan(){
	console.log("clear pan function")
	msg = "Message Board"

	if(pan_item_name == "steak" ||pan_item_name == "asparagus"){
		world.remove(pan_item)

		// clear pan_items
		pan_item = undefined
		pan_item_name = undefined

		if (clearSound.isPlaying()==false){
			clearSound.play()
		}

		msg = "Your pan is now empty"
	}
	else if(pan_item_name == "cooked steak"){
		world.remove(cooked_steak.utensil)
		
		// clear pan_items
		pan_item = undefined
		pan_item_name = undefined

		if (clearSound.isPlaying()==false){
			clearSound.play()
		}

		msg = "Your pan is now empty"
	}
	else if(pan_item_name == "cooked asparagus"){
		world.remove(cooked_asparagus.utensil)
		
		// clear pan_items
		pan_item = undefined
		pan_item_name = undefined

		if (clearSound.isPlaying()==false){
			clearSound.play()
		}

		msg = "Your pan is now empty"
	}
	else{
		if (errorSound.isPlaying()==false){
			errorSound.play()
		}
		msg = "You have nothing in your pan"

	}
	


}

function plateIngredientRemoval(){
	for(let i=0; i < food_in_plate.length; i++){
		// cheese slice is not a class we wrote therefore have to be treated differently
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

// Effects ------------
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

function cookNoodle(){
	// sound effect for boiling noodle	
	msg= "Please wait ... \n\n Now Cooking Noodle"
	

	// add water
	water = new Circle({
		x:-0.95, y:0.94, z:5.04,
		red:175, green:238, blue:238,
		radius: 0.11,
		rotationX: -90,rotationY: 90,
	})
	// world.add(water)
	noodle_container.addChild(water)
	pot_has.push("water")

	// water filling animation in draw()
	// add water sound
	

	if(!water_filled){
		start_water = true
	}

	setTimeout(() => {
		if(water_filled){
			waterSound.pause()

			// add water to container
			water.setY(1)
		}

		if (finishSound.isPlaying()==false){
			finishSound.play()
		}
		// start boiling
		// start_bubble = true

		// setTimeout(() => {
		// 	start_bubble = false
		// finished boiling! 
			noodle_cooked = true
			msg ="The Noodle is Ready"
			// user will now click the pot again
		// }, 5000);
	}, 2000)
	console.log()


}


// ****************************** CLASSES ******************************
// ---------------------------------------------------------------------
class Bubbles{

	constructor(x,y,z) {

		this.myBox = new Sphere({
			x:x+random(0.035, 0.045), y:y-0.2+random(0.15, 0.22), z:z+random(0.01, 0.05),
			red: 255, green:230, blue:random(170,180),
			radius: 0.015
		});

		world.add(this.myBox);

		this.xOffset = random(1000);
		this.zOffset = random(2000, 3000);
	}

	move() {

		var yMovement = 0.001;
		var xMovement = map( noise(this.xOffset), 0, 1, -0.001, 0.001);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.001, 0.001);

		this.xOffset += 0.01;
		this.yOffset += 0.01;


		this.myBox.nudge(xMovement, yMovement, zMovement);

		var boxScale = this.myBox.getScale();
		this.myBox.setScale( boxScale.x-0.0025, boxScale.y-0.0025, boxScale.z-0.0025);

		if (boxScale.x <= 0) {
			world.remove(this.myBox);
			return "gone";
		}
		else {
			return "ok";
		}
	}
}

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
				if (fridge_open.isPlaying()==false){
					fridge_open.play()
				}

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
				if (fridge_close.isPlaying()==false){
					fridge_close.play()
				}
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

					if (selectedSound.isPlaying()==false){
						selectedSound.play()
					}

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
					else if(selected_items_name == "egg"){
						pot_item = selected_items
						pot_item_name = selected_items_name
					}
					else if(selected_items_name == "pan"){
						panFunction()
					}
					else if(selected_items_name == "pot"){
						potFunction()
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

					if (eating.isPlaying()==false){
						eating.play()
					}

					current_customer.remove_from_world()
					let prev_customer = current_customer
					while(prev_customer == current_customer){
						current_customer = random(customers_list);
					}
					msg = "You successfully \n served a " + current_order

					set_random_customer_order()
					current_customer.add_to_world()

					// serve order
					serveOrder()

					iscorrect_food = false


				}
				else{
					if (errorSound.isPlaying()==false){
						errorSound.play()
					}
					msg = "The order is not ready or wrong \n If this is noodle \n Click assemble order"
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
				set_random_customer_order()

				if (kickOutSound.isPlaying()==false){
					kickOutSound.play()
				}

				// console.log("Kicked out the customer");
				remaining_time = int(random(60,120))

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
		if (new_customer_sound.isPlaying()==false){
			new_customer_sound.play()
		}

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
